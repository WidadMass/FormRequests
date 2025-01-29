"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserByEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("./userModel"));
// Vérifier si l'utilisateur existe par email
const findUserByEmail = async (email) => {
    return await userModel_1.default.findOne({ email });
};
exports.findUserByEmail = findUserByEmail;
// Créer un nouvel utilisateur avec un mot de passe haché
const createUser = async (userData) => {
    // Hacher le mot de passe
    const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
    const newUser = new userModel_1.default({ ...userData, password: hashedPassword });
    return await newUser.save();
};
exports.createUser = createUser;
