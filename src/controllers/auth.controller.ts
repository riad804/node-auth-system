import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, TokenPayload, verifyToken } from '../utils/generateToken';
import { sendAdminInvite, sendVerificationEmail } from '../services/mail.service';
import { User } from '../models';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const payload: TokenPayload = {
      email: user.email,
      role: 'user',
    };
    const token = generateToken(payload, process.env.EMAIL_TOKEN_SECRET!, '1d');
    await sendVerificationEmail(email, token);
    res.status(201).json({ message: 'Signup complete. Verify your email.' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {payload, expired} = verifyToken(req.params.token, process.env.EMAIL_TOKEN_SECRET!);
    if (expired) {
      return res.status(401).json({message: 'Token expired'});
    } else if (!payload) {
      return res.status(403).json({message: 'Invalid token'});
    }

    const user = await User.findOne({ where: { email: payload.email, role: payload.role} });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if (!user || !user.password) return res.status(401).json({ message: 'Unauthorized' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const payload: TokenPayload = {
      email: user.email,
      role: user.role || 'user',
    };
    const accessToken = generateToken(payload, process.env.JWT_SECRET!, '15m');
    const refreshToken = generateToken(payload, process.env.REFRESH_SECRET!, '7d');
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const inviteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email exists' });

    const user = await User.create({ email, role: 'admin', isVerified: false });
    const payload: TokenPayload = {
      email: user.email,
      role: user.role || 'user',
    };
    const token = generateToken(payload, process.env.EMAIL_TOKEN_SECRET!, '1d');
    await sendAdminInvite(email, token);
    res.status(201).json({ message: 'Invite sent' });
  } catch (err) {
    next(err);
  }
};

export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;
    const { payload, expired } = verifyToken(req.params.token, process.env.EMAIL_TOKEN_SECRET!);
    if (expired) {
      return res.status(401).json({message: 'Token expired'});
    } else if (!payload) {
      return res.status(403).json({message: 'Invalid token'});
    }
    const user = await User.findOne({ where: { email: payload.email }});
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Password set successfully' });
  } catch (err) {
    next(err);
  }
};


export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const { payload, expired } = verifyToken(token, process.env.REFRESH_SECRET!);
    if (expired) return res.status(401).json({ message: 'Token expired' });
    if (!payload) return res.status(403).json({ message: 'Invalid token' });

    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAccessToken = generateToken(payload, process.env.JWT_SECRET!, '15m');
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};