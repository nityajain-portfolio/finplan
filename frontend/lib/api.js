import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

export const getClients    = ()           => API.get('/api/clients');
export const getClient     = (id)         => API.get(`/api/clients/${id}`);
export const createClient  = (data)       => API.post('/api/clients', data);
export const updateClient  = (id, data)   => API.put(`/api/clients/${id}`, data);

export const getDashboard  = (id, year)   => API.get(`/api/dashboard/${id}`, { params: { year } });

export const getRevMonthly = (id, year)   => API.get(`/api/revenue/${id}/monthly`, { params: { year } });
export const getRevByStream= (id, year)   => API.get(`/api/revenue/${id}/by-stream`, { params: { year } });
export const addRevenue    = (id, data)   => API.post(`/api/revenue/${id}`, data);

export const getCostSummary    = (id, year) => API.get(`/api/costs/${id}/summary`, { params: { year } });
export const getCostByCategory = (id, year) => API.get(`/api/costs/${id}/by-category`, { params: { year } });
export const getCostFixedVar   = (id, year) => API.get(`/api/costs/${id}/fixed-vs-variable`, { params: { year } });

export const getAssets      = (id) => API.get(`/api/assets/${id}`);
export const getLiabilities = (id) => API.get(`/api/liabilities/${id}`);
export const getCashflow    = (id, year) => API.get(`/api/cashflow/${id}`, { params: { year } });
export const getKpis        = (id) => API.get(`/api/kpis/${id}`);
export const getNotes       = (id) => API.get(`/api/notes/${id}`);
export const addNote        = (id, data) => API.post(`/api/notes/${id}`, data);

export default API;
