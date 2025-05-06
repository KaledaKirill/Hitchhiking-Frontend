import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Server error response:', error.response?.data);
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getCurrentUser = () => api.get('/users/me');

export const getAllRides = () => api.get('/rides');
export const getRidesByDriverId = (userId) => api.get(`/rides/search/driver/id?driverId=${userId}`);
export const getRidesByPassengerId = (userId) => api.get(`/rides/search/passenger/id?passengerId=${userId}`);
export const createRide = (rideData) => api.post('/rides/create', rideData);
export const getRideById = (rideId) => api.get(`/rides/${rideId}`);

export default api;