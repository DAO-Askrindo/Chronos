"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjects = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getProjects = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        // In a real app with strict parameterization, we enforce RLS or filter by tenantId
        const projects = await prisma_1.default.project.findMany({
            where: {
                tenantId,
            },
            include: {
                portfolio: true,
                _count: {
                    select: { tasks: true, members: true }
                }
            }
        });
        return res.json({ data: projects });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const userId = req.user.id;
        const { name, key, description, portfolioId } = req.body;
        const result = await prisma_1.default.$transaction(async (tx) => {
            // Create the explicit project
            const project = await tx.project.create({
                data: {
                    tenantId,
                    name,
                    key,
                    description,
                    status: 'Planning', // Technically this should refer to a sys_params if fully param'd
                    portfolioId: portfolioId || null,
                }
            });
            // Find an Admin role (in reality, we would define what Admin means via UUID)
            const adminRole = await tx.role.findFirst({
                where: { tenantId, name: 'SuperAdmin' } // Simplified for MVP
            });
            if (adminRole) {
                // Automatically assign the creator as the Admin of this project
                await tx.projectMember.create({
                    data: {
                        projectId: project.id,
                        userId,
                        roleId: adminRole.id
                    }
                });
            }
            return project;
        });
        return res.status(201).json({ message: 'Project created successfully', data: result });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createProject = createProject;
