import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return { id: payload.id, role: payload.role };
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    // update decoded user
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // optimistic set id/role then fetch full profile
        setUser({ id: payload.id, role: payload.role });
        (async () => {
          try {
            const res = await fetch('http://localhost:7001/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok && data.user) setUser({ id: data.user.id, role: data.user.role, username: data.user.username });
          } catch (err) {
            console.error('Failed to fetch user profile', err);
          }
        })();
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authService.login(username, password);
      if (res.token) {
        setToken(res.token);
        setLoading(false);
  // if logged in via modal, close it
  setModalOpen(false);
        return { ok: true };
      }
      setLoading(false);
      return { ok: false, message: res.message || 'Login failed' };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    try {
      const res = await authService.register(username, password);
      setLoading(false);
  // keep modal open? close so user can login
  setModalOpen(false);
  return res;
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.message || 'Register failed' };
    }
  };

  const logout = () => {
    setToken(null);
  setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setModalMode(mode);
    setModalOpen(true);
  };

  const openAuthModalWithRedirect = (mode = 'login', path = null) => {
    setModalMode(mode);
    setRedirectTo(path);
    setModalOpen(true);
  };

  const clearRedirect = () => setRedirectTo(null);

  const closeAuthModal = () => setModalOpen(false);

  return (
  <AuthContext.Provider value={{ token, user, loading, login, register, logout, modalOpen, modalMode, redirectTo, openAuthModal: openAuthModalWithRedirect, closeAuthModal, clearRedirect }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;