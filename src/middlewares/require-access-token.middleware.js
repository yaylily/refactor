import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const requireAccessToken = async (req, res, next) => {
  try {
    await authService.requireAccessToken(req, res, next);
  } catch (error) {
    next(error);
  }
};
