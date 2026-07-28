import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

// Agregamos allowedRole (puede ser 'admin' u 'operador')
const ProtectedRoute = ({ allowedRole }) => {
  // Extraemos esAdmin de nuestro contexto actualizado
  const { isAuthenticated, esAdmin } = useAuth(); 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta exige ser OPERADOR, pero el que entra ES ADMIN
  if (allowedRole === 'operador' && esAdmin) {
    // Lo redirigimos a donde estará su futuro panel de administrador
    return <Navigate to="/admin" replace />;
  }

  // Si la ruta exige ser ADMIN, pero el que entra NO ES ADMIN
  if (allowedRole === 'admin' && !esAdmin) {
    // Lo redirigimos de vuelta a su panel de operador
    return <Navigate to="/operador" replace />;
  }

  // Si pasa todas las validaciones, le mostramos la página
  return <Outlet />;
};

export default ProtectedRoute;