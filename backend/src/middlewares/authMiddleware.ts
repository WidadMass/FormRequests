import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1) Étendre l'interface Request pour inclure la propriété user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// 2) Middleware pour vérifier le token
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Token manquant ou mal formaté. Accès refusé.' });
    return;
  }

  try {
    // On caste le token décodé pour qu'il contienne { id: string; role: string }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    req.user = decoded; // => { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};
