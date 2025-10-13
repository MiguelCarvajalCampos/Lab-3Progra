import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, getCurrentUser } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('accessToken');
        } finally {
          // Ya sea que funcione o falle, terminamos de cargar
          setIsLoading(false); 
        }
      };
      fetchUser();
    } else {
      // Si no hay token, no estamos cargando nada
      setIsLoading(false); 
    }
  }, []);

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    localStorage.setItem('accessToken', response.data.access_token);
    const userResponse = await getCurrentUser();
    setUser(userResponse.data);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  // Exponemos "isLoading" para que otros componentes lo puedan usar
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};