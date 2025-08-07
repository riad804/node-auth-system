import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
}
export const methodNotAllowedHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(405).json({ message: 'Method Not Allowed' });
};

export const errorMiddleware = {
  errorHandler,
  notFoundHandler,
  methodNotAllowedHandler
};
export default errorMiddleware;