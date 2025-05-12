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

export const registerUser = (userData) => api.post('api/v1/auth/register', userData);
export const loginUser = (credentials) => api.post('api/v1/auth/login', credentials);

export const getCurrentUser = () => api.get('api/v1/users/me');
export const updateUser = (id, userData) => api.put(`api/v1/users/update/${id}`, userData);

export const getAllRides = (filters = {}) => api.get('api/v1/rides', { params: filters });
export const getRidesByDriverId = (userId) => api.get(`api/v1/rides/search/driver/id?driverId=${userId}`);
export const getRidesByPassengerId = (userId) => api.get(`api/v1/rides/search/passenger/id?passengerId=${userId}`);
export const createRide = (rideData) => api.post('api/v1/rides/create', rideData);
export const getRideById = (rideId) => api.get(`api/v1/rides/${rideId}`);
export const deleteRide = (rideId) => api.delete(`api/v1/rides/delete/${rideId}`);
export const addPassenger = (rideId, userId) => api.post(`api/v1/rides/${rideId}/passenger/${userId}`);
export const removePassenger = (rideId, userId) => api.delete(`api/v1/rides/${rideId}/passenger/${userId}`);
export const updateRide = (rideId, rideData) => api.put(`api/v1/rides/update/${rideId}`, rideData);

export default api;