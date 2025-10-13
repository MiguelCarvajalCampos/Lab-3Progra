import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Funciones de API de Autenticación ---
export const register = (userData) => apiClient.post('/auth/register', userData);

export const login = (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  return apiClient.post('/auth/login', formData);
};

export const getCurrentUser = () => apiClient.get('/users/me');

export const getTags = () => apiClient.get('/tags');
export const createTag = (tagData) => apiClient.post('/tags', tagData);

export const getTasks = () => apiClient.get('/tasks');
export const createTask = (taskData) => apiClient.post('/tasks', taskData);
export const updateTask = (id, taskData) => apiClient.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => apiClient.delete(`/tasks/${id}`);