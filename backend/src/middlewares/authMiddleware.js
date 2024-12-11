const jwt = require('jsonwebtoken');

// Vérifier si l'utilisateur est connecté
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token manquant. Accès refusé.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide.' });
  }
};

// Vérifier si l'utilisateur a le rôle ADMIN
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas administrateur.' });
  }
  next();
};
