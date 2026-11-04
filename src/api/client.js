// src/api/client.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur pour ajouter le token JWT
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    const isAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register');

    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Gestion du token expiré ou invalide
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Éviter la boucle infinie sur la page login
      if (currentPath !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        toast.error('Session expirée. Veuillez vous reconnecter.', {
          duration: 3000,
          style: {
            background: '#EF4444',
            color: 'white',
            fontWeight: '600',
            borderRadius: '16px',
            padding: '12px 20px',
          },
        });
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default client;