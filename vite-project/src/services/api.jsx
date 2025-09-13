import axios from 'axios';

// Set base URL for API calls
//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
 const API_BASE_URL = import.meta.env.VITE_API_URL ||'http://localhost:5000/api'; 
// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Transform response to convert _id to id for MongoDB
api.interceptors.response.use(
  (response) => {
    // Convert _id to id for consistency
    if (response.data && typeof response.data === 'object') {
      const transformId = (obj) => {
        if (obj && obj._id) {
          obj.id = obj._id;
          delete obj._id;
        }
        
        // Convert MongoDB dates to JavaScript Date objects
        if (obj && obj.createdAt) {
          obj.createdAt = new Date(obj.createdAt);
        }
        if (obj && obj.updatedAt) {
          obj.updatedAt = new Date(obj.updatedAt);
        }
        if (obj && obj.date) {
          obj.date = new Date(obj.date);
        }
        if (obj && obj.due_date) {
          obj.due_date = new Date(obj.due_date);
        }
        
        return obj;
      };
      
      if (Array.isArray(response.data)) {
        response.data = response.data.map(transformId);
      } else {
        response.data = transformId(response.data);
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/user'),
};

// Customers API calls
export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Invoices API calls
export const invoicesAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (invoice) => api.post('/invoices', invoice),
  updateStatus: (id, status) => api.patch(`/invoices/${id}/status`, { status }),
  update: (id, invoice) => api.put(`/invoices/${id}`, invoice),
  delete: (id) => api.delete(`/invoices/${id}`),
  getStats: (params) => api.get('/invoices/stats/overview', { params }),
};

// Expenses API calls
export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (expense) => api.post('/expenses', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStats: (params) => api.get('/expenses/stats/overview', { params }),
  getCategories: () => api.get('/expenses/categories/list'),
};

// Inventory API calls
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (product) => api.post('/inventory', product),
  update: (id, product) => api.put(`/inventory/${id}`, product),
  delete: (id) => api.delete(`/inventory/${id}`),
  updateStock: (id, stock) => api.patch(`/inventory/${id}/stock`, { stock }),
  getStats: () => api.get('/inventory/stats/overview'),
  getCategories: () => api.get('/inventory/categories/list'),
};

// Reports API calls
export const reportsAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getExpensesReport: (params) => api.get('/reports/expenses', { params }),
  getProfitLossReport: (params) => api.get('/reports/profit-loss', { params }),
  getInventoryReport: (params) => api.get('/reports/inventory', { params }),
  getDashboardOverview: (params) => api.get('/reports/dashboard', { params }),
};

// Settings API calls
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (settings) => api.put('/settings', settings),
  updateSection: (section, data) => api.patch(`/settings/${section}`, data),
};

export default api;