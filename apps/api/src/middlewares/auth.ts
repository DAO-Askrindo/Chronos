import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../utils/prisma';

export interface AuthRequest extends Request {
    user?: any;
    activeTenantId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized. Missing or invalid token format.' });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyToken(token);

        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Unauthorized. User inactive or deleted.' });
        }

        req.user = user;
        req.activeTenantId = payload.activeTenantId;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
};
