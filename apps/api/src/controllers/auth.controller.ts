import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const { tenantName, userName, email, password } = req.body;

        // 1. Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Create Tenant, User, and Default Admin Role in a Transaction
        const result = await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: { name: tenantName },
            });

            const role = await tx.role.create({
                data: {
                    tenantId: tenant.id,
                    name: 'SuperAdmin',
                    isSystem: true,
                    description: 'Full access to the tenant',
                },
            });

            const user = await tx.user.create({
                data: {
                    tenantId: tenant.id,
                    name: userName,
                    email,
                    passwordHash,
                },
            });

            return { tenant, user, role };
        });

        const token = generateToken({ userId: result.user.id, activeTenantId: result.tenant.id });

        return res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                activeTenantId: result.tenant.id,
            },
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid credentials or inactive user' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ userId: user.id, activeTenantId: user.tenantId });

        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                activeTenantId: user.tenantId,
            },
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const switchTenant = async (req: Request, res: Response) => {
    // To be implemented: Validate if user has access to targetTenantId
    res.status(501).json({ message: 'Not Implemented Yet' });
};
