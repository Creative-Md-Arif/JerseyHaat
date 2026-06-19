import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  },
});

// Response interceptor
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      import.meta.env.VITE_ADMIN_TOKEN ||
      "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  },
);

// Auth check
export const verifyAdmin = async () => {
  try {
    await api.get('/orders/stats');
    return true;
  } catch {
    return false;
  }
};

export const loginAdmin = async (token) => {
  localStorage.setItem("adminToken", token);
  const isValid = await verifyAdmin();
  if (!isValid) {
    localStorage.removeItem("adminToken"); 
    throw new Error("Invalid Admin Token");
  }
  return true;
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};

// Products
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/products', { params: { ...params, limit: 100 } });
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Clubs
export const getAllClubsAdmin = async () => {
  const response = await api.get('/clubs/all');
  return response.data;
};

export const createClub = async (formData) => {
  const response = await api.post('/clubs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateClub = async (id, formData) => {
  const response = await api.put(`/clubs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteClub = async (id) => {
  const response = await api.delete(`/clubs/${id}`);
  return response.data;
};

// Banners
export const getAllBannersAdmin = async () => {
  const response = await api.get('/banners/all');
  return response.data;
};

export const createBanner = async (formData) => {
  const response = await api.post('/banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateBanner = async (id, formData) => {
  const response = await api.put(`/banners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteBanner = async (id) => {
  const response = await api.delete(`/banners/${id}`);
  return response.data;
};

// Orders
export const getAllOrders = async (params = {}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const getOrderStats = async () => {
  const response = await api.get('/orders/stats');
  return response.data;
};

export default api;
