import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  Users, 
  Send, 
  Inbox, 
  Check, 
  X, 
  MessageSquare, 
  Briefcase, 
  Clock, 
  ArrowUpRight, 
  Sparkles 
} from 'lucide-react';

export default function CollaborationsHub({ onOpenStudent }) {
  const { user } = useAuth();
  const [collabs, setCollabs] = useState({ incoming: [], outgoing: [], total_active: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  
  // Chat messaging panel state
  const [selectedCollab, setSelectedCollab] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const loadCollaborations = async () => {
    setLoading(true);
    try {
      const data = await api.getMyCollaborations();
      setCollabs(data);
      // Auto-select first accepted collab for chat if available
      const firstAccepted = [...data.incoming, ...data.outgoing].find(c => c.status === 'accepted');
      if (firstAccepted && !selectedCollab) {
        setSelectedCollab(firstAccepted);
      }
    } catch (err) {
      console.error('Failed to load collaborations', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (collabId) => {
    try {
      const list = await api.getCollabMessages(collabId);
      setMessages(list);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    loadCollaborations();
  }, [user]);

  useEffect(() => {
    if (selectedCollab) {
      loadMessages(selectedCollab.id);
    }
  }, [selectedCollab]);

  const handleUpdateStatus = async (collabId, status) => {
    try {
      await api.updateCollabStatus(collabId, status);
      loadCollaborations();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCollab) return;
    setSendingMsg(true);
    try {
      const targetReceiverId = selectedCollab.sender_id === user.id 
        ? selectedCollab.receiver_id 
        : selectedCollab.sender_id;

      await api.sendCollabMessage(selectedCollab.id, {
        receiver_id: targetReceiverId,
        content: newMessage
      });
      setNewMessage('');
      loadMessages(selectedCollab.id);
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs">
            <Users className="w-4 h-4 text-indigo-300" />
            <span>Peer-to-Peer Networking Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Collaboration Requests & Teams</h1>
          <p className="text-indigo-200 text-sm max-w-2xl leading-relaxed">
            Review incoming student project invitations to Accept or Reject, track sent requests, and collaborate with your squad.
          </p>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-2xl p-4 text-center shrink-0">
          <span className="text-xs uppercase font-bold text-indigo-200">Active Collaborations</span>
          <div className="text-3xl font-black text-white mt-0.5">{collabs.total_active}</div>
        </div>
      </div>

      {/* Main Grid: Requests on Left, Messaging on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Request Lists */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('incoming')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    activeTab === 'incoming'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>Received ({collabs.incoming.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('outgoing')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    activeTab === 'outgoing'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Sent by You ({collabs.outgoing.length})</span>
                </button>
              </div>
            </div>

            {/* List Content */}
            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs">Loading requests...</div>
            ) : activeTab === 'incoming' ? (
              collabs.incoming.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                  No incoming collaboration requests right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {collabs.incoming.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition space-y-3 ${
                        selectedCollab?.id === req.id
                          ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={req.sender_avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.sender_name}`}
                            alt={req.sender_name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 bg-white shrink-0 mt-0.5"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span 
                                onClick={() => onOpenStudent && onOpenStudent(req.sender_id)}
                                className="font-bold text-sm sm:text-base text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                              >
                                {req.sender_name}
                              </span>
                              <span className="text-[11px] text-slate-400 truncate">• {req.sender_dept}</span>
                            </div>
                            <div className="text-xs font-semibold text-indigo-700 mt-0.5 truncate">
                              Project: {req.project_title}
                            </div>
                            <div className="text-[11px] font-medium text-slate-500">
                              Role Requested: <span className="font-semibold text-slate-800">{req.role_needed}</span>
                            </div>
                          </div>
                        </div>

                        {req.status === 'pending' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                            Pending
                          </span>
                        )}
                        {req.status === 'accepted' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Accepted
                          </span>
                        )}
                        {req.status === 'declined' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                            Rejected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                        "{req.message}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">{req.created_at?.slice(0, 10)}</span>
                        
                        <div className="flex items-center gap-2">
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'accepted')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'declined')}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold flex items-center gap-1 transition"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {req.status === 'accepted' && (
                            <button
                              onClick={() => setSelectedCollab(req)}
                              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Open Chat</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              collabs.outgoing.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs sm:text-sm">
                  You haven't sent any collaboration requests yet. Visit Talent Discovery to find teammates!
                </div>
              ) : (
                <div className="space-y-3">
                  {collabs.outgoing.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400">Invited:</span>
                            <span className="font-bold text-sm sm:text-base text-slate-900">{req.receiver_name}</span>
                          </div>
                          <div className="text-xs font-semibold text-indigo-700 mt-0.5">
                            Project: {req.project_title}
                          </div>
                          <div className="text-[11px] font-medium text-slate-500">
                            Role: <span className="font-semibold text-slate-800">{req.role_needed}</span>
                          </div>
                        </div>

                        {req.status === 'pending' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                        {req.status === 'accepted' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Accepted
                          </span>
                        )}
                        {req.status === 'declined' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Declined
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                        "{req.message}"
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">{req.created_at?.slice(0, 10)}</span>
                        {req.status === 'accepted' && (
                          <button
                            onClick={() => setSelectedCollab(req)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Open Chat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Column: In-Platform Project Messaging Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col h-[560px] justify-between">
            {selectedCollab ? (
              <>
                {/* Chat Header */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {selectedCollab.sender_id === user.id ? selectedCollab.receiver_name : selectedCollab.sender_name}
                    </h3>
                    <p className="text-[11px] text-indigo-600 font-medium">
                      Project: {selectedCollab.project_title}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Live Channel
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-16">
                      No chat messages yet. Start collaborating by saying hello!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_id === user.id;
                      return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-tr-xs'
                                : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                            }`}
                          >
                            <p>{m.content}</p>
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message or share repository links..."
                    className="flex-1 text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">Select an Accepted Collaboration</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Once a collaboration request is accepted, your team communication workspace activates right here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
