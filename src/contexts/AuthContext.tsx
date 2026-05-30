// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService, { type User, type LoginPayload, type RegisterPayload } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate(); // ✅ Agora funciona porque está dentro do Router
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const storedUser = AuthService.getStoredUser();
      
      if (storedUser) {
        try {
          const freshUser = await AuthService.me();
          setUser(freshUser);
        } catch {
          AuthService.clearTokens();
          localStorage.removeItem('cinemar_user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await AuthService.login(payload);
      setUser(response.user);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao fazer login.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await AuthService.register(payload);
      setUser(response.user);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao registrar.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch {
      // Ignorar erros no logout
    } finally {
      setUser(null);
      setIsLoading(false);
      window.dispatchEvent(new Event('storage'));
      navigate('/login');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAdmin,
      isAuthenticated,
      login,
      register,
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}