// frontend/src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://backend-cinemar-6.onrender.com';
const API_VERSION = 'api/v1';

// URLs separadas para API e Uploads
export const API_URL = `${API_BASE_URL}/${API_VERSION}`;
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

// Instância principal para API
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // ← MUDADO: 15 segundos para 60 segundos
});

// Função para obter URL completa da imagem
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/images/fallback-poster.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  // Se for apenas o nome do arquivo
  return `${UPLOADS_URL}/filmes/${path}`;
};

// Helpers de token
export const getAccessToken = () => localStorage.getItem('cinemar_access_token');
export const getRefreshToken = () => localStorage.getItem('cinemar_refresh_token');

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('cinemar_access_token', accessToken);
  localStorage.setItem('cinemar_refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('cinemar_access_token');
  localStorage.removeItem('cinemar_refresh_token');
  localStorage.removeItem('cinemar_user');
};

// Função para wake-up do backend (prevenir timeout na primeira requisição)
export const wakeUpBackend = async (): Promise<void> => {
  try {
    // Requisição rápida para acordar o backend
    await axios.get(`${API_URL}/filmes?limit=1`, { timeout: 30000 });
    console.log('✅ Backend acordado com sucesso');
  } catch (error) {
    // Ignora erro - o backend pode já estar acordado
    console.log('⚠️ Wake-up call falhou, mas continuando...');
  }
};

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (value: string) => void; reject: (reason?: unknown) => void }> = [];

const processPending = (error: unknown | null, token?: string) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Se for timeout, tenta novamente uma vez
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('⏱️ Timeout, tentando novamente...');
      return api(originalRequest);
    }
    
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Sem refresh token');
      }

      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      saveTokens(data.accessToken, data.refreshToken);
      
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      processPending(null, data.accessToken);
      
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      processPending(err);
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;