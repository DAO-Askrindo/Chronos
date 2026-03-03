"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
/**
 * Middleware to check if the active user has a specific permission in their active tenant context.
 */
const requirePermission = (permissionCode) => {
    return async (req, res, next) => {
        try {
            const activeTenantId = req.activeTenantId;
            const userId = req.user?.id;
            if (!activeTenantId || !userId) {
                return res.status(401).json({ error: 'Missing authentication context.' });
            }
            const userWithRoles = await prisma_1.default.user.findUnique({
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
            }
            else {
                userWithRoles?.projectMembers.forEach(pm => {
                    const codes = pm.role.permissions.map(p => p.permissionCode);
                    if (codes.includes(permissionCode))
                        hasPermission = true;
                });
            }
            if (!hasPermission) {
                return res.status(403).json({ error: `Forbidden. Requires permission: ${permissionCode}` });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({ error: 'Error processing permissions' });
        }
    };
};
exports.requirePermission = requirePermission;
