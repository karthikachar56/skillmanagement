import os
import json
import uuid
import asyncio
from typing import Dict, Any, List, Optional
import motor.motor_asyncio
from app.config import MONGODB_URL, DB_NAME, DATA_DIR

# Global DB state
use_mongo = False
mongo_client = None
mongo_db = None

class AsyncJSONCursor:
    def __init__(self, items: List[Dict[str, Any]]):
        self._items = items
        self._idx = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self._idx < len(self._items):
            item = self._items[self._idx]
            self._idx += 1
            return item
        raise StopAsyncIteration

    async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
        if length is not None:
            return self._items[:length]
        return list(self._items)

    def sort(self, key_or_list, direction=1):
        # basic sort support
        field = key_or_list if isinstance(key_or_list, str) else key_or_list[0][0]
        reverse = (direction == -1) if isinstance(key_or_list, str) else (key_or_list[0][1] == -1)
        self._items.sort(key=lambda x: x.get(field, ""), reverse=reverse)
        return self

class LocalJSONCollection:
    def __init__(self, name: str, filepath: str):
        self.name = name
        self.filepath = filepath
        self._lock = asyncio.Lock()
        self._ensure_file()

    def _ensure_file(self):
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    def _read_data(self) -> List[Dict[str, Any]]:
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_data(self, data: List[Dict[str, Any]]):
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    def _matches(self, doc: Dict[str, Any], filter_dict: Optional[Dict[str, Any]]) -> bool:
        if not filter_dict:
            return True
        for k, v in filter_dict.items():
            if k == "_id" and "_id" not in doc and "id" in doc:
                if doc["id"] != str(v):
                    return False
                continue
            if k == "id" and "id" not in doc and "_id" in doc:
                if str(doc["_id"]) != str(v):
                    return False
                continue
            if isinstance(v, dict):
                # Operator support: $in, $regex, $gte, $lte, $ne
                doc_val = doc.get(k)
                for op, op_val in v.items():
                    if op == "$in":
                        if isinstance(doc_val, list):
                            if not any(x in op_val for x in doc_val):
                                return False
                        elif doc_val not in op_val:
                            return False
                    elif op == "$ne":
                        if doc_val == op_val:
                            return False
                    elif op == "$regex":
                        import re
                        if not re.search(str(op_val), str(doc_val or ""), re.IGNORECASE):
                            return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    async def find(self, filter_dict: Optional[Dict[str, Any]] = None) -> AsyncJSONCursor:
        async with self._lock:
            docs = self._read_data()
            matched = [dict(d) for d in docs if self._matches(d, filter_dict)]
            return AsyncJSONCursor(matched)

    async def find_one(self, filter_dict: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        async with self._lock:
            docs = self._read_data()
            for d in docs:
                if self._matches(d, filter_dict):
                    return dict(d)
            return None

    async def insert_one(self, doc: Dict[str, Any]):
        async with self._lock:
            docs = self._read_data()
            doc_copy = dict(doc)
            if "_id" not in doc_copy and "id" not in doc_copy:
                doc_copy["_id"] = str(uuid.uuid4())
                doc_copy["id"] = doc_copy["_id"]
            elif "id" in doc_copy and "_id" not in doc_copy:
                doc_copy["_id"] = doc_copy["id"]
            elif "_id" in doc_copy and "id" not in doc_copy:
                doc_copy["id"] = str(doc_copy["_id"])
            docs.append(doc_copy)
            self._write_data(docs)
            class InsertResult:
                inserted_id = doc_copy["_id"]
            return InsertResult()

    async def update_one(self, filter_dict: Dict[str, Any], update_dict: Dict[str, Any]):
        async with self._lock:
            docs = self._read_data()
            matched_count = 0
            modified_count = 0
            for i, d in enumerate(docs):
                if self._matches(d, filter_dict):
                    matched_count = 1
                    if "$set" in update_dict:
                        for k, v in update_dict["$set"].items():
                            d[k] = v
                        modified_count = 1
                    if "$push" in update_dict:
                        for k, v in update_dict["$push"].items():
                            if k not in d or not isinstance(d[k], list):
                                d[k] = []
                            d[k].append(v)
                        modified_count = 1
                    docs[i] = d
                    break
            if modified_count:
                self._write_data(docs)
            class UpdateResult:
                def __init__(self, m, mod):
                    self.matched_count = m
                    self.modified_count = mod
            return UpdateResult(matched_count, modified_count)

    async def delete_one(self, filter_dict: Dict[str, Any]):
        async with self._lock:
            docs = self._read_data()
            idx_to_remove = -1
            for i, d in enumerate(docs):
                if self._matches(d, filter_dict):
                    idx_to_remove = i
                    break
            deleted = 0
            if idx_to_remove >= 0:
                docs.pop(idx_to_remove)
                self._write_data(docs)
                deleted = 1
            class DeleteResult:
                deleted_count = deleted
            return DeleteResult()

    async def count_documents(self, filter_dict: Optional[Dict[str, Any]] = None) -> int:
        async with self._lock:
            docs = self._read_data()
            return sum(1 for d in docs if self._matches(d, filter_dict))

class AwaitableMotorCursor:
    def __init__(self, cursor):
        self._cursor = cursor

    def __await__(self):
        async def _identity():
            return self
        return _identity().__await__()

    async def to_list(self, length=None):
        return await self._cursor.to_list(length=length)

    def sort(self, *args, **kwargs):
        self._cursor.sort(*args, **kwargs)
        return self

    def limit(self, *args, **kwargs):
        self._cursor.limit(*args, **kwargs)
        return self

    def skip(self, *args, **kwargs):
        self._cursor.skip(*args, **kwargs)
        return self

    def __aiter__(self):
        return self._cursor.__aiter__()

    def __getattr__(self, name):
        return getattr(self._cursor, name)

class MotorCollectionWrapper:
    def __init__(self, raw_col):
        self._col = raw_col

    def find(self, *args, **kwargs):
        return AwaitableMotorCursor(self._col.find(*args, **kwargs))

    async def count_documents(self, filter_dict=None, *args, **kwargs):
        if filter_dict is None:
            filter_dict = {}
        return await self._col.count_documents(filter_dict, *args, **kwargs)

    def __getattr__(self, name):
        return getattr(self._col, name)

class DBManager:
    def __init__(self):
        self.collections: Dict[str, Any] = {}
        self.mongo_collections: Dict[str, Any] = {}

    def get_collection(self, name: str):
        global use_mongo, mongo_db
        if use_mongo and mongo_db is not None:
            if name not in self.mongo_collections:
                self.mongo_collections[name] = MotorCollectionWrapper(mongo_db[name])
            return self.mongo_collections[name]
        
        if name not in self.collections:
            path = os.path.join(DATA_DIR, f"{name}.json")
            self.collections[name] = LocalJSONCollection(name, path)
        return self.collections[name]

db_manager = DBManager()

try:
    import certifi
    has_certifi = True
except ImportError:
    has_certifi = False

async def sync_local_data_to_mongo():
    global mongo_db
    if mongo_db is None:
        return
    collections = ["users", "certificates", "collaborations", "opportunities", "messages"]
    for col_name in collections:
        try:
            col = mongo_db[col_name]
            count = await col.count_documents({})
            if count == 0:
                json_path = os.path.join(DATA_DIR, f"{col_name}.json")
                if os.path.exists(json_path):
                    with open(json_path, "r", encoding="utf-8") as f:
                        items = json.load(f)
                    if items and isinstance(items, list):
                        # Clean up items to ensure valid MongoDB documents
                        for item in items:
                            if "id" in item and "_id" not in item:
                                item["_id"] = item["id"]
                        await col.insert_many(items)
                        print(f"[*] Migrated {len(items)} records from {col_name}.json into MongoDB collection '{col_name}'")
        except Exception as e:
            print(f"[!] Migration warning for {col_name}: {e}")

async def init_db():
    global use_mongo, mongo_client, mongo_db
    try:
        kwargs = {
            "serverSelectionTimeoutMS": 8000
        }
        if "mongodb+srv://" in MONGODB_URL or "ssl=true" in MONGODB_URL.lower():
            if has_certifi:
                kwargs["tlsCAFile"] = certifi.where()
            kwargs["tlsAllowInvalidCertificates"] = True

        client = motor.motor_asyncio.AsyncIOMotorClient(
            MONGODB_URL,
            **kwargs
        )
        await client.server_info()
        mongo_client = client
        mongo_db = client[DB_NAME]
        use_mongo = True
        print(f"[*] Connected to MongoDB: {DB_NAME}")
        await sync_local_data_to_mongo()
    except Exception as e:
        use_mongo = False
        os.makedirs(DATA_DIR, exist_ok=True)
        print(f"[!] MongoDB not reachable ({e}). Seamlessly using persistent JSON Document Database at {DATA_DIR}")

def get_db_status():
    return {
        "engine": "MongoDB" if use_mongo else "Persistent JSON Document DB",
        "database": DB_NAME,
        "is_mongo": use_mongo
    }
