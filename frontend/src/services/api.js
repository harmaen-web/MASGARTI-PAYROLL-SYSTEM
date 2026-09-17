const API_URL = import.meta.env.VITE_API_URL || '/api';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  health: () => request('/health'),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),
  getDashboardStats: (month) =>
    request(`/dashboard/stats${month ? `?month=${encodeURIComponent(month)}` : ''}`),
  getEmployees: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null))
    ).toString();
    return request(`/employees${query ? `?${query}` : ''}`);
  },
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (payload) =>
    request('/employees', { method: 'POST', body: JSON.stringify(payload) }),
  updateEmployee: (id, payload) =>
    request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
  previewPayroll: (employeeId) => request(`/payroll/preview?employeeId=${employeeId}`),
  processPayroll: (payload) =>
    request('/payroll/process', { method: 'POST', body: JSON.stringify(payload) }),
  getPayrollHistory: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null))
    ).toString();
    return request(`/payroll/history${query ? `?${query}` : ''}`);
  },
  getPayrollById: (id) => request(`/payroll/${id}`),
};
