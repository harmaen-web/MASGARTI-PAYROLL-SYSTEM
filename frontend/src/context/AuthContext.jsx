import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('masgarti_token');
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    api
      .getMe()
      .then((res) => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('masgarti_token');
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setSession = useCallback((response) => {
    localStorage.setItem('masgarti_token', response.token);
    setAuthToken(response.token);
    setUser(response.user);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.login(credentials);
    setSession(response);
    return response;
  }, [setSession]);

  const register = useCallback(async (payload) => {
    const response = await api.register(payload);
    setSession(response);
    return response;
  }, [setSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('masgarti_token');
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
