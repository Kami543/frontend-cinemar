// frontend/src/services/auth.service.ts
import api, { clearTokens, saveTokens } from './api';

export interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  nome: string;
  password: string;
}

const AuthService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    // Primeiro, limpa tokens antigos antes do login
    clearTokens();
    
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    saveTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('cinemar_user', JSON.stringify(data.user));
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    // Limpa qualquer token existente antes do registro
    clearTokens();
    
    // ✅ Converte 'nome' para 'name' que o backend espera
    const backendPayload = {
      email: payload.email,
      name: payload.nome,  // ← conversão: nome -> name
      password: payload.password,
    };
    
    const { data } = await api.post<AuthResponse>('/auth/register', backendPayload);
    saveTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('cinemar_user', JSON.stringify(data.user));
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignorar erro
    }
    this.clearTokens();
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    localStorage.setItem('cinemar_user', JSON.stringify(data));
    return data;
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem('cinemar_user');
    return raw ? (JSON.parse(raw) as User) : null;
  },

  isAdmin(): boolean {
    return this.getStoredUser()?.role === 'admin';
  },

  clearTokens(): void {
    clearTokens();
    localStorage.removeItem('cinemar_user');
  },
};

export default AuthService;