import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { MongooseUserRepository } from '../../infrastructure/repositories/MongooseUserRepository';

const userRepository = new MongooseUserRepository();
const authService = new AuthService(userRepository);

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await authService.registerAdmin(email, password);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const result = await authService.updateProfile(userId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
