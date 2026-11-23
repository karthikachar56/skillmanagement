const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('skillbridge_token') || '';
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('skillbridge_token', token);
  } else {
    localStorage.removeItem('skillbridge_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const err = await response.json();
      errorDetail = err.detail || err.message || errorDetail;
    } catch (e) {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  getDemoUsers: () => request('/auth/demo-users'),
  demoLogin: (userId) => request(`/auth/demo-login/${userId}`, { method: 'POST' }),

  // Students & Profile
  getStudents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/students${query ? `?${query}` : ''}`);
  },
  getStudentProfile: (id) => request(`/students/${id}`),
  updateProfile: (data) => request('/students/profile', { method: 'PUT', body: JSON.stringify(data) }),
  addSkill: (data) => request('/students/skills', { method: 'POST', body: JSON.stringify(data) }),
  deleteSkill: (name) => request(`/students/skills/${encodeURIComponent(name)}`, { method: 'DELETE' }),
  addProject: (data) => request('/students/projects', { method: 'POST', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/students/projects/${id}`, { method: 'DELETE' }),
  endorseSkill: (studentId, skillName) => request(`/students/endorse/${studentId}/${encodeURIComponent(skillName)}`, { method: 'POST' }),

  // Search Engine
  searchTalents: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    return request(`/search/talents?${query.toString()}`);
  },

  // Certificates
  getMyCertificates: () => request('/certificates/my'),
  getVerificationQueue: () => request('/certificates/queue'),
  uploadCertificate: (data) => request('/certificates/upload', { method: 'POST', body: JSON.stringify(data) }),
  reviewCertificate: (id, data) => request(`/certificates/${id}/review`, { method: 'POST', body: JSON.stringify(data) }),
  getCertStats: () => request('/certificates/stats'),

  // Collaborations
  getMyCollaborations: () => request('/collaborations'),
  sendCollaboration: (data) => request('/collaborations', { method: 'POST', body: JSON.stringify(data) }),
  updateCollabStatus: (id, status) => request(`/collaborations/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getCollabMessages: (id) => request(`/collaborations/${id}/messages`),
  sendCollabMessage: (id, data) => request(`/collaborations/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),

  // Opportunities
  getOpportunities: (type) => request(`/opportunities${type ? `?type=${type}` : ''}`),
  createOpportunity: (data) => request('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  applyOpportunity: (id, data) => request(`/opportunities/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  getApplications: (id) => request(`/opportunities/${id}/applications`),

  // AI & Matching
  getIndustryRoles: () => request('/ai/roles'),
  analyzeSkillGap: (data) => request('/ai/skill-gap', { method: 'POST', body: JSON.stringify(data) }),
  buildAiTeam: (data) => request('/ai/team-builder', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics & Admin
  getAnalyticsOverview: () => request('/analytics/overview'),
  getAllUsers: () => request('/admin/users'),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
};
