import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('studystack_token');
    const storedUser  = localStorage.getItem('studystack_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveSession = (authResponse) => {
    const { token, user } = authResponse.data;
    localStorage.setItem('studystack_token', token);
    localStorage.setItem('studystack_user',  JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    saveSession(res);
    return res.data.user;
  }, []);

  const registerUser = useCallback(async (name, email, password, role) => {
    const res = await apiRegister({ name, email, password, role });
    saveSession(res);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('studystack_token');
    localStorage.removeItem('studystack_user');
    setToken(null);
    setUser(null);
  }, []);

  const isInstructor = user?.role === 'instructor';

  return (
    <AuthContext.Provider value={{ user, token, loading, isInstructor, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
