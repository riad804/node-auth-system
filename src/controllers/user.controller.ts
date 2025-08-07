import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'isVerified', 'createdAt']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const promoteToEditor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'user') return res.status(400).json({ message: 'Can only promote regular users' });

    user.role = 'editor';
    await user.save();

    res.json({ message: 'User promoted to editor' });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};