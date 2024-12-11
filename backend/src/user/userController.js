const User = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Enregistrer un utilisateur
exports.registerUser = async (req, res) => {
    try {
        console.log(req.body); // Debug pour vérifier les données reçues
      const { firstName, lastName, email, password } = req.body;
  
      if (!password) {
        return res.status(400).json({ message: 'Le mot de passe est requis.' });
      }
  
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        
      }
  
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Mot de passe haché :', hashedPassword);
      // Créer un nouvel utilisateur
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        
      });
  
      await newUser.save();
      console.log(`Nouvel utilisateur enregistré : ${email}`);
      res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Connexion utilisateur

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Vérifiez si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Connexion réussie pour : ${email}`);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclure les mots de passe pour des raisons de sécurité
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un utilisateur spécifique par son ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { currentPassword, newPassword, ...updateFields } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Si un changement de mot de passe est demandé
    if (currentPassword && newPassword) {
      // Vérifier l'ancien mot de passe
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.password = hashedPassword;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password'); // Exclure le mot de passe des résultats

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
