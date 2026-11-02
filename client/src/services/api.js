import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1', withCredentials: true, timeout: 330000 });
api.interceptors.response.use((response) => response.data, (error) => {
  const payload = error.response?.data?.error;
  return Promise.reject(Object.assign(new Error(payload?.message || 'We could not reach the case server. Please try again.'), {
    code: payload?.code || 'NETWORK_ERROR', status: error.response?.status,
  }));
});

export const createCase = (storyPrompt, difficulty) => api.post('/cases', { storyPrompt, difficulty });
export const getCase = (caseId) => api.get(`/cases/${caseId}`);
export const inspectEvidence = (caseId, evidenceId) => api.post(`/cases/${caseId}/evidence/${evidenceId}/inspect`);
export const submitAccusation = (caseId, suspectId, explanation) => api.post(`/cases/${caseId}/accusations`, { suspectId, explanation });
export const getVerdict = (caseId) => api.get(`/cases/${caseId}/verdict`);
