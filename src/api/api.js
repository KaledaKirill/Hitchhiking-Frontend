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
export const updateUser = (id, userData) => api.put(`/users/update/${id}`, userData);

export const getAllRides = (filters = {}) => api.get('/rides', { params: filters });
export const getRidesByDriverId = (userId) => api.get(`/rides/search/driver/id?driverId=${userId}`);
export const getRidesByPassengerId = (userId) => api.get(`/rides/search/passenger/id?passengerId=${userId}`);
export const createRide = (rideData) => api.post('/rides/create', rideData);
export const getRideById = (rideId) => api.get(`/rides/${rideId}`);
export const deleteRide = (rideId) => api.delete(`/rides/delete/${rideId}`);
export const addPassenger = (rideId, userId) => api.post(`/rides/${rideId}/passenger/${userId}`);
export const removePassenger = (rideId, userId) => api.delete(`/rides/${rideId}/passenger/${userId}`);
export const updateRide = (rideId, rideData) => api.put(`/rides/update/${rideId}`, rideData);

export default api;