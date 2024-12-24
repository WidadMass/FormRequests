const Request = require('./requestModel');
const { sendEmail } = require('../services/emailService');

// Soumettre une demande
exports.submitRequest = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    const request = new Request({
      userId: req.user.id,  // Récupérer l'ID de l'utilisateur connecté
      type,
      startDate,
      endDate
    });

    await request.save();
    res.status(201).json({ message: 'Demande soumise avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Voir les demandes d'un utilisateur (employé)
exports.viewUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Voir toutes les demandes en attente (accessible aux managers et admins)
exports.viewPendingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'Pending' });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Demande introuvable.' });
    }

    request.status = 'Approved';
    await request.save();

    // Envoyer un email après l'approbation
    const user = await User.findById(request.userId); // Récupérer les infos utilisateur
    if (user) {
      const subject = 'Votre demande a été approuvée';
      const text = `Bonjour ${user.firstName},\n\nVotre demande de type "${request.type}" a été approuvée.\n\nCordialement,\nL'équipe.`;
      await sendEmail(user.email, subject, text);
    }

    res.status(200).json({ message: 'Demande approuvée avec succès.', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Rejeter une demande
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;  // Motif du rejet
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Demande non trouvée.' });
    }

    request.status = 'Rejected';
    request.reason = reason;  // Enregistrer le motif du rejet

    await request.save();
    res.status(200).json({ message: 'Demande rejetée avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
