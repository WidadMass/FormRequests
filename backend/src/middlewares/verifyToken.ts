import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type DecodedToken = {
  id: string;
  role: string;
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Token manquant. Accès refusé.' });
    return;
  }

  try {
    // On cast en { id: string; role: string }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    req.user = decoded; // Maintient la cohérence : { id, role }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};
