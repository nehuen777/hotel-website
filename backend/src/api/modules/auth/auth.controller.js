import * as authService from './auth.services.js';

export async function login(req, res) {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ message: 'Email and contrasena are required' });
  }

  try {
    const result = await authService.autenticarOperador(email, contrasena);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}