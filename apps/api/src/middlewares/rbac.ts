import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../utils/prisma';

/**
 * Middleware to check if the active user has a specific permission in their active tenant context.
 */
export const requirePermission = (permissionCode: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const activeTenantId = req.activeTenantId;
            const userId = req.user?.id;

            if (!activeTenantId || !userId) {
                return res.status(401).json({ error: 'Missing authentication context.' });
            }

            const userWithRoles = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    projectMembers: {
                        where: {
                            project: { tenantId: activeTenantId }
                        },
                        include: {
                            role: {
                                include: { permissions: true }
                            }
                        }
                    }
                }
            });

            // Simple implementation: Check if any of the user's roles across any project in this tenant has the permission
            // For a truly robust RBAC, this might need more granularity (e.g. checking permission on a specific projectId)
            let hasPermission = false;

            // Temporary bypass for SuperAdmins (Assuming name 'SuperAdmin' is protected)
            const isSuperAdmin = userWithRoles?.projectMembers.some(pm => pm.role.name === 'SuperAdmin');

            if (isSuperAdmin) {
                hasPermission = true;
            } else {
                userWithRoles?.projectMembers.forEach(pm => {
                    const codes = pm.role.permissions.map(p => p.permissionCode);
                    if (codes.includes(permissionCode)) hasPermission = true;
                });
            }

            if (!hasPermission) {
                return res.status(403).json({ error: `Forbidden. Requires permission: ${permissionCode}` });
            }

            next();
        } catch (error) {
            return res.status(500).json({ error: 'Error processing permissions' });
        }
    };
};
