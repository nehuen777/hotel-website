import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: sessionStorage.getItem('token'), isAuthenticated: !!sessionStorage.getItem('token') });

  const login = async (email, contrasena) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const { token } = await response.json();
      sessionStorage.setItem('token', token);
      setAuth({ token, isAuthenticated: true });
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setAuth({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
