import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../core/repositories/IUserRepository';
import logger from '../../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'ozaco-secret-key';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(email: string, password: string) {
    logger.debug(`Login attempt for: ${email}`);
    const user = await this.userRepository.findByEmail(email);

    if (!user || user.role !== 'admin') {
      logger.warn(`Failed login attempt: ${email} - Unauthorized or non-admin`);
      throw new Error('Invalid admin credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Failed login attempt: ${email} - Incorrect password`);
      throw new Error('Invalid admin credentials');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info(`Successful admin login: ${email}`);
    return { 
        token, 
        role: user.role, 
        user: { 
            id: user._id, 
            email: user.email, 
            name: user.name, 
            profilePic: user.profilePic 
        } 
    };
  }

  async registerAdmin(email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn(`Admin registration attempt failed: ${email} already exists`);
      throw new Error('User already exists');
    }
    const newUser = await this.userRepository.create({ email, password, role: 'admin' });
    logger.info(`New admin registered: ${email}`);
    return newUser;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    
    if (data.name) user.name = data.name;
    if (data.profilePic) user.profilePic = data.profilePic;
    if (data.password) user.password = data.password;
    
    const updatedUser = await user.save();
    return {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        profilePic: updatedUser.profilePic
    };
  }
}
