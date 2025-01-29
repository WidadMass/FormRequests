import bcrypt from 'bcrypt';
import User, { IUser } from './userModel';

// Vérifier si l'utilisateur existe par email
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

// Créer un nouvel utilisateur avec un mot de passe haché
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(userData.password as string, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  return await newUser.save();
};
