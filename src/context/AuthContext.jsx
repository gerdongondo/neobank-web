// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);  // ← AJOUTER
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');  // ← AJOUTER

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);  // ← AJOUTER
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login(email, password);

    if (response.success) {
      const userData = {
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      };

      // 🔥 Déterminer le rôle (admin si email contient admin ou si API renvoie le rôle)
      const userRole = 
        response.email === 'admin@neobank.com' || 
        response.email === 'superadmin@neobank.com' 
          ? 'ADMIN' 
          : 'USER';

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole);  // ← AJOUTER

      setToken(response.token);
      setUser(userData);
      setRole(userRole);  // ← AJOUTER
      return response;
    }
    throw new Error(response.message);
  };

  const register = async (data) => {
    return await authApi.register(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');  // ← AJOUTER
    setToken(null);
    setUser(null);
    setRole(null);  // ← AJOUTER
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,  // ← AJOUTER
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: role === 'ADMIN',  // ← AJOUTER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};