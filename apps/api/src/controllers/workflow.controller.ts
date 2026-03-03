import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getWorkflows = async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.activeTenantId!;

        // Sort workflows by orderIndex so Kanban columns appear correctly
        const workflows = await prisma.workflowState.findMany({
            where: { tenantId },
            orderBy: { orderIdx: 'asc' }
        });

        return res.json({ data: workflows });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createWorkflow = async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.activeTenantId!;
        const { name, category, color, orderIdx } = req.body;

        const workflow = await prisma.workflowState.create({
            data: {
                tenantId,
                name,
                category, // IN_PROGRESS, DONE, TODO
                color,
                orderIdx
            }
        });

        return res.status(201).json({ data: workflow });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
