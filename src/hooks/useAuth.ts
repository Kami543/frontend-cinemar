// /src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import AuthService, { type User, type LoginPayload, type RegisterPayload } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: AuthService.getStoredUser(),
    isLoading: false,
    isAdmin: AuthService.isAdmin(),
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = AuthService.getStoredUser();
    if (!stored) return;

    AuthService.me()
      .then((user) => setState({ user, isLoading: false, isAdmin: user.role === 'admin' }))
      .catch(() => {
        setState({ user: null, isLoading: false, isAdmin: false });
      });
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setError(null);
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await AuthService.login(payload);
      setState({ user: res.user, isLoading: false, isAdmin: res.user.role === 'admin' });
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao fazer login.';
      setError(msg);
      setState((s) => ({ ...s, isLoading: false }));
      throw err;
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setError(null);
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await AuthService.register(payload);
      setState({ user: res.user, isLoading: false, isAdmin: res.user.role === 'admin' });
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao registrar.';
      setError(msg);
      setState((s) => ({ ...s, isLoading: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setState({ user: null, isLoading: false, isAdmin: false });
  }, []);

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAdmin: state.isAdmin,
    isAuthenticated: !!state.user,
    error,
    login,
    register,
    logout,
  };
}