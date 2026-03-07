import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 120000, // 2 min — AI analysis (parse + embed + score) can take 40–60s
});

// â”€â”€â”€ Request interceptor: attach JWT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ats_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// â”€â”€â”€ Response interceptor: handle 401 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || "";
    const isAuthRoute = url.includes("/auth/");
    if (error?.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("ats_token");
      localStorage.removeItem("ats_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const auth = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
};

// â”€â”€â”€ Jobs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const jobs = {
  getAll: () => api.get("/jobs"),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post("/jobs", data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// â”€â”€â”€ Candidates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const candidates = {
  getByJob: (jobId) => api.get(`/candidates/job/${jobId}`),
  uploadResume: (formData) => api.post("/candidates/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateStatus: (id, status) => api.patch(`/candidates/${id}/status`, { status }),
  deleteCandidate: (id) => api.delete(`/candidates/${id}`),
  getInterviewQuestions: (candidateId) => api.get(`/candidates/${candidateId}/interview-questions`),
  search: (query) => api.get("/candidates/search", { params: { q: query } }),
  getNotes: (candidateId) => api.get(`/candidates/${candidateId}/notes`),
  addNote: (candidateId, content) => api.post(`/candidates/${candidateId}/notes`, { content }),
  deleteNote: (candidateId, noteId) => api.delete(`/candidates/${candidateId}/notes/${noteId}`),
  addTag: (candidateId, tag) => api.post(`/candidates/${candidateId}/tags`, { tag }),
  removeTag: (candidateId, tag) => api.delete(`/candidates/${candidateId}/tags/${encodeURIComponent(tag)}`),
};

// Interviews
export const interviews = {
  schedule: (data) => api.post("/interviews", data),
  getByJob: (jobId) => api.get(`/interviews/job/${jobId}`),
  getByCandidate: (candidateId) => api.get(`/interviews/candidate/${candidateId}`),
  update: (id, data) => api.patch(`/interviews/${id}`, data),
  getUpcoming: () => api.get("/interviews/upcoming"),
};

// Audit logs
export const auditLogs = {
  getAll: (filters) => api.get("/audit-logs", { params: filters }),
  getByCandidate: (candidateId, limit = 50) => api.get(`/audit-logs/candidate/${candidateId}`, { params: { limit } }),
};

// â”€â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Users (Admin only)
export const users = {
  getAll: (status) => api.get("/users", { params: status ? { status } : {} }),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  create: (data) => api.post("/users", data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const dashboard = {
  getStats: () => api.get("/dashboard"),
};

export default api;
