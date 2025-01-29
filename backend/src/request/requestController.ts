// src/request/requestController.ts
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import RequestService from './requestService';
import RequestModel from './requestModel';  // renommé
import File from '../file/fileModel';


export const submitRequest = async (
  req: ExpressRequest,
  res: Response
): Promise<void> => {
  try {
    console.log('Corps de la requête (req.body) :', req.body);
    console.log('Fichier reçu (req.file) :', req.file);

    // Vérifie que req.user existe
    if (!req.user) {
      res.status(401).json({ error: 'Utilisateur non authentifié.' });
      return;
    }

    const {
      type,
      description,
      startDate,
      endDate,
      service,
      natureConge,
      periodeFrais,
      montantFrais,
      incidentDescription,
    } = req.body;

    // Validation basique
    if (!type) {
      res.status(400).json({ error: 'Le type de demande est obligatoire.' });
      return;
    }
    if (type === 'Congé' && !startDate) {
      res.status(400).json({ error: 'Une date de début est obligatoire pour ce type.' });
      return;
    }

    // Validation conditionnelle
    switch (type) {
      case 'Congé':
        if (!natureConge) {
          res.status(400).json({ error: 'La nature du congé est obligatoire.' });
          return;
        }
        break;
      case 'Note de Frais':
        if (!periodeFrais || !montantFrais) {
          res.status(400).json({ error: 'La période et le montant sont obligatoires.' });
          return;
        }
        break;
      case 'Incident':
        if (!incidentDescription) {
          res.status(400).json({ error: 'La description est obligatoire pour un incident.' });
          return;
        }
        break;
      case 'Autre Demande':
        // Pas de validation supplémentaire
        break;
      default:
        res.status(400).json({ error: 'Type de demande non reconnu.' });
        return;
    }

    // Création d'un document Mongoose avec le modèle RequestModel
    const request = new RequestModel({
      userId: req.user.id, // req.user vient de l'authMiddleware
      type,
      description: description || '',
      startDate: startDate || null,
      endDate: endDate || null,
      service: service || null,
      natureConge: natureConge || null,
      periodeFrais: periodeFrais || null,
      montantFrais: montantFrais || null,
      incidentDescription: incidentDescription || null,
    });

    await request.save();

    // Gestion d'un fichier uploadé (req.file)
    if (req.file) {
      const newFile = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: req.file.path,
        userId: req.user.id,
        requestId: request._id, // On utilise _id généré par Mongoose
      });

      await newFile.save();
      request.files = [newFile._id];
      await request.save();
    }

    res.status(201).json({
      message: 'Demande soumise avec succès.',
      request,
    });
  } catch (error: any) {
    console.error('Erreur lors de la soumission de la demande :', error.message);
    res.status(500).json({
      error: `Erreur lors de la création de la demande : ${error.message}`,
    });
  }
};


export const viewUserRequests = async (
  req: ExpressRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Utilisateur non authentifié.' });
      return;
    }

    const requests = await RequestService.getRequestsByUser(req.user.id);
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const viewPendingRequests = async (
  req: ExpressRequest,
  res: Response
): Promise<void> => {
  try {
    const requests = await RequestService.getPendingRequests();
    res.status(200).json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const approveRequest = async (
  req: ExpressRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // findByIdAndUpdate sur RequestModel
    const request = await RequestModel.findByIdAndUpdate(
      id,
      { status: 'Approved' },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ error: 'Demande introuvable.' });
      return;
    }

    res.status(200).json({ message: 'Demande approuvée avec succès.', request });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const rejectRequest = async (
  req: ExpressRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const request = await RequestService.rejectRequest(id, reason);
    res.status(200).json({ message: 'Demande rejetée avec succès.', request });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
