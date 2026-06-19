import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Club API
export const getClubs = async () => {
  const response = await api.get('/clubs');
  return response.data;
};

export const getClubBySlug = async (slug) => {
  const response = await api.get(`/clubs/${slug}`);
  return response.data;
};

// Product API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const getNewArrivals = async () => {
  const response = await api.get('/products/new');
  return response.data;
};

export const getBestSellers = async () => {
  const response = await api.get('/products/bestsellers');
  return response.data;
};

export const getProductsByClub = async (clubSlug) => {
  const response = await api.get(`/products/club/${clubSlug}`);
  return response.data;
};

export const getProductsByType = async (type) => {
  const response = await api.get(`/products/type/${type}`);
  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

// Banner API
export const getBanners = async () => {
  const response = await api.get('/banners');
  return response.data;
};

// Order API
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export default api;
