"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.getMyProfile = exports.loginUser = exports.registerUser = exports.toggleUserStatus = void 0;
exports.updatePassword = updatePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("./userModel")); // Supposons que `userModel.ts` exporte un type ou une interface IUser
// Basculer le statut actif/inactif d'un utilisateur
const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        // Trouver l'utilisateur par son ID
        const user = await userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
            return;
        }
        // Basculer le statut actif/inactif
        user.isActive = !user.isActive;
        // Sauvegarder les modifications
        await user.save();
        res.status(200).json({
            message: `Le statut de l'utilisateur a été ${user.isActive ? 'activé' : 'désactivé'}.`,
            user,
        });
    }
    catch (error) {
        res.status(500).json({ error: `Erreur lors de la modification du statut : ${error.message}` });
    }
};
exports.toggleUserStatus = toggleUserStatus;
// Enregistrer un nouvel utilisateur
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, role, service } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email et mot de passe sont requis.' });
            return;
        }
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            return;
        }
        // Hacher le mot de passe
        const salt = await bcrypt_1.default.genSalt(12);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        // Créer un nouvel utilisateur
        const newUser = new userModel_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone: phone || '',
            role: role || 'EMPLOYEE',
            service,
        });
        await newUser.save();
        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                service: newUser.service,
                isActive: newUser.isActive,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.registerUser = registerUser;
// Connexion d'un utilisateur
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email et mot de passe sont requis.' });
            return;
        }
        // Rechercher l'utilisateur
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur introuvable.' });
            return;
        }
        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect.' });
            return;
        }
        // Générer le token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.loginUser = loginUser;
// Récupérer le profil de l'utilisateur connecté
const getMyProfile = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.user?.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur introuvable.' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.getMyProfile = getMyProfile;
// Récupérer un utilisateur par son ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel_1.default.findById(id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'Utilisateur introuvable.' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.getUserById = getUserById;
// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.default.find().select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword, ...updateFields } = req.body;
        const user = await userModel_1.default.findById(id);
        if (!user) {
            res.status(404).json({ message: 'Utilisateur introuvable.' });
            return;
        }
        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
                return;
            }
            const salt = await bcrypt_1.default.genSalt(12);
            const hashedPassword = await bcrypt_1.default.hash(newPassword, salt);
            updateFields.password = hashedPassword;
        }
        const updatedUser = await userModel_1.default.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true }).select('-password');
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.updateUser = updateUser;
// Supprimer un utilisateur
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ message: 'Utilisateur introuvable.' });
            return;
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
exports.deleteUser = deleteUser;
function updatePassword(req, res) {
    throw new Error('Function not implemented.');
}
