import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getSystemParameters = async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.activeTenantId!;
        const category = req.query.category as string;

        // Allow filtering by parameter category (e.g. 'ISSUE_TYPE', 'PRIORITY')
        const whereClause: any = { tenantId, isActive: true };
        if (category) {
            whereClause.category = category;
        }

        const parameters = await prisma.systemParameter.findMany({
            where: whereClause
        });

        return res.json({ data: parameters });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createSystemParameter = async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.activeTenantId!;
        const { category, label, value, color } = req.body;

        const parameter = await prisma.systemParameter.create({
            data: {
                tenantId,
                category,
                label,
                value,
                color
            }
        });

        return res.status(201).json({ data: parameter });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
