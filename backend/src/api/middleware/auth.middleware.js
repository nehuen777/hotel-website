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
    req.operador = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
}