import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. AHORA leemos también el 'esAdmin' desde el sessionStorage al iniciar
  const [auth, setAuth] = useState({ 
    token: sessionStorage.getItem('token'), 
    isAuthenticated: !!sessionStorage.getItem('token'),
    // El sessionStorage guarda strings, así que lo convertimos a booleano
    esAdmin: sessionStorage.getItem('esAdmin') === 'true' || sessionStorage.getItem('esAdmin') === '1'
  });

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

      // 2. AHORA desestructuramos también el esAdmin que nos manda el backend
      const { token, esAdmin } = await response.json();
      
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('esAdmin', esAdmin); // Guardamos el rol en sesión

      // 3. AHORA actualizamos el estado con el nuevo valor
      setAuth({ token, isAuthenticated: true, esAdmin: Boolean(esAdmin) });
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('esAdmin'); // Limpiamos el rol al salir
    setAuth({ token: null, isAuthenticated: false, esAdmin: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);