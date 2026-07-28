import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret_key'; // ¡Mover a una variable de entorno en producción!

export function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token format is invalid.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
}

export function esOperador(req, res, next) {
  // En SQL Server el bit llega como boolean a Node, por eso validamos false
  if (req.usuario && (req.usuario.esAdmin === false || req.usuario.esAdmin === 0)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Requires operator privileges.' });
  }
}

// NUEVO: Validamos si es administrador
export function esAdmin(req, res, next) {
  if (req.usuario && (req.usuario.esAdmin === true || req.usuario.esAdmin === 1)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Requires admin privileges.' });
  }
}