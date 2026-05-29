// frontend/src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = 'https://backend-cinemar-6.onrender.com';
const API_VERSION = 'api/v1';

export const API_URL = `${API_BASE_URL}/${API_VERSION}`;
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

// ✅ Funções de token PADRONIZADAS com 'cinemar_' prefixo
export const getAccessToken = () => {
  const token = localStorage.getItem('cinemar_access_token');
  if (!token) {
    console.warn('⚠️ Nenhum token encontrado com chave "cinemar_access_token"');
  }
  return token;
};

export const getRefreshToken = () => {
  return localStorage.getItem('cinemar_refresh_token');
};

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('cinemar_access_token', accessToken);
  localStorage.setItem('cinemar_refresh_token', refreshToken);
  console.log('✅ Tokens salvos com sucesso (cinemar_)');
};

export const clearTokens = () => {
  localStorage.removeItem('cinemar_access_token');
  localStorage.removeItem('cinemar_refresh_token');
  localStorage.removeItem('cinemar_user');
  console.log('🗑️ Tokens removidos');
};

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/images/fallback-poster.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_BASE_URL}${path}`;
  return `${UPLOADS_URL}/filmes/${path}`;
};

export const wakeUpBackend = async (): Promise<void> => {
  try {
    console.log('🌐 Acordando backend em:', API_URL);
    await axios.get(`${API_URL}/filmes?limit=1`, { timeout: 30000 });
    console.log('✅ Backend acordado com sucesso');
  } catch (error) {
    console.log('⚠️ Wake-up call falhou, mas continuando...', error);
  }
};

// Request interceptor - CORRETO
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`🔑 Token adicionado para: ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    console.warn(`⚠️ Sem token para: ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response interceptor para refresh token
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
    
    // Timeout retry
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('⏱️ Timeout, tentando novamente...');
      return api(originalRequest);
    }
    
    // Se não for 401 ou já tentou refresh, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se já está refreshando, adiciona na fila
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

      console.log('🔄 Tentando refresh token...');
      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      
      // Salva os novos tokens
      saveTokens(data.accessToken, data.refreshToken);
      
      // Atualiza o header padrão
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      
      // Processa a fila de requisições pendentes
      processPending(null, data.accessToken);
      
      // Retenta a requisição original
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      console.error('❌ Refresh token falhou:', err);
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