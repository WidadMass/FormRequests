// src/middlewares/verifyRole.ts
import { Request, Response, NextFunction } from 'express';

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Vérifier si l'utilisateur est authentifié
    if (!req.user) {
      res.status(403).json({ message: 'Utilisateur non authentifié.' });
      return;
    }

    // Ici, req.user est { id: string; role: string }
    const userRole = req.user.role;

    // Vérifier si le rôle de l'utilisateur est autorisé
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        message: `Accès refusé. Rôle requis : ${allowedRoles.join(' ou ')}.`,
      });
      return;
    }

    // L'utilisateur a un rôle autorisé, passer au contrôleur suivant
    next();
  };
};
