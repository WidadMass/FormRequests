import { Request, Response } from 'express';
import File, { IFile } from './fileModel'; // Assurez-vous que `IFile` est défini dans fileModel

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Vérification si aucun fichier n'est envoyé
    if (!req.file) {
      res.status(400).json({ message: 'Aucun fichier envoyé.' });
      return;
    }

    // Enregistre les détails du fichier dans la base de données
    const newFile: IFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: req.file.path,
    });

    await newFile.save();

    res.status(201).json({
      message: 'Fichier uploadé avec succès.',
      file: newFile,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Erreur serveur.',
      error: error.message,
    });
  }
};
