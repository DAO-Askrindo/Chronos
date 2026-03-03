import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-chronos-key';

export interface TokenPayload {
    userId: string;
    activeTenantId: string;
}

import { SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: TokenPayload, expiresIn: SignOptions['expiresIn'] = '1d'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};
