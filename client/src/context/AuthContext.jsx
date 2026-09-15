import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import queryClient from '@/lib/queryClient';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken'); localStorage.removeItem('user');
    setSession(null); queryClient.clear();
  }, []);
  useEffect(() => {
    let alive = true;
    const token = localStorage.getItem('accessToken');
    if (token) api.get('/auth/me').then(({ data }) => {
      if (alive && token === localStorage.getItem('accessToken')) setSession({ token, user: data.user });
    }).catch(() => { if (alive) logout(); }).finally(() => { if (alive) setLoading(false); });
    else Promise.resolve().then(() => { if (alive) setLoading(false); });
    const storageChanged = event => { if (event.key === 'accessToken') logout(); };
    window.addEventListener('auth-expired', logout);
    window.addEventListener('storage', storageChanged);
    return () => { alive = false; window.removeEventListener('auth-expired', logout); window.removeEventListener('storage', storageChanged); };
  }, [logout]);
  const login = ({ token, user }) => {
    queryClient.clear(); localStorage.setItem('accessToken', token); setSession({ token, user });
  };
  return <AuthContext.Provider value={{ user: session?.user, token: session?.token, loading, isAuthenticated: !!session, login, logout }}>{children}</AuthContext.Provider>;
};
// Context hook intentionally shares this module with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
