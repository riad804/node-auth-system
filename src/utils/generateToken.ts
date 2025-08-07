import jwt from 'jsonwebtoken';

export interface TokenPayload {
  email: string;
  role: string;
}

export const generateToken = (
    payload: TokenPayload,
    secret: string = process.env.JWT_SECRET || 'default_secret',
    expires: any = '1h',
): string => {
    return jwt.sign(payload, secret, {expiresIn: expires});
}

export const verifyToken = (
    token: string,
    secret: string = process.env.JWT_SECRET || 'default_secret',
): {payload: TokenPayload | null; expired: boolean} => {
    try {
        const decode = jwt.verify(token, secret) as TokenPayload;
        return {payload: decode, expired: isTokenExpired(token, secret)};
    } catch (error) {
        console.error('Token verification failed:', error);
        return {
            payload: null,
            expired: (error as Error).message.includes('jwt expired')
        };
    }
}

export const isTokenExpired = (token: string, secret?: string): boolean => {
  try {
    jwt.verify(token, secret || process.env.JWT_SECRET || 'default_secret');
    return false;
  } catch (error) {
    return (error as jwt.JsonWebTokenError).name === 'TokenExpiredError';
  }
};