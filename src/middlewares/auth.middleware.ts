import {Request, Response, NextFunction} from 'express';
import { TokenPayload, verifyToken } from '../utils/generateToken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({message: 'No token provided'});
  }

  try {
    const {payload, expired} = verifyToken(token);
    if (expired) {
      return res.status(401).json({message: 'Token expired'});
    } else if (!payload) {
      return res.status(403).json({message: 'Invalid token'});
    }
    const user = {
      email: payload.email,
      role: payload.role
    };
    
    (req as any).payload = user as TokenPayload;
    next();
  } catch (error) {
    return res.status(403).json({message: 'Forbidden'});
  }
}