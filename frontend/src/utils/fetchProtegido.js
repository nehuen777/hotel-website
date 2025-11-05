export const fetchProtegido = async (url, options = {}) => {
  const token = sessionStorage.getItem('token');

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token inválido o expirado, podríamos limpiar el storage y redirigir a login
    sessionStorage.removeItem('token');
    window.location.href = '/login'; 
    throw new Error('Sesión expirada. Por favor, inicie sesión de nuevo.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || 'Ocurrió un error en la petición');
  }

  // Si la respuesta no tiene cuerpo (ej. 204 No Content), no intentar parsear JSON
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
