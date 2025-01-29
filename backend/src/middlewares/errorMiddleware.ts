import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb'; // Pour typer les erreurs MongoDB

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Les données envoyées sont invalides.',
      details: err.details,
    });
    return;
  }

  if ((err as MongoError).code === 11000) {
    res.status(409).json({
      message: 'Cet email est déjà pris.',
    });
    return;
  }

  res.status(500).json({ message: err.message || 'Erreur serveur.' });
};
