"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskState = exports.createTask = exports.getTasks = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getTasks = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const projectId = req.query.projectId;
        const whereClause = { tenantId, deletedAt: null };
        if (projectId)
            whereClause.projectId = projectId;
        const tasks = await prisma_1.default.task.findMany({
            where: whereClause,
            include: {
                state: true,
                type: true,
                priority: true,
                assignee: { select: { id: true, name: true, email: true } }
            },
            orderBy: { weight: 'desc' }
        });
        return res.json({ data: tasks });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const reporterId = req.user.id;
        const { projectId, title, description, stateId, typeId, priorityId, assigneeId, customData } = req.body;
        // Generate Issue Key (in a real app, you'd auto-increment based on project prefix)
        const issueKey = `CHR-${Math.floor(Math.random() * 10000)}`;
        const task = await prisma_1.default.task.create({
            data: {
                tenantId,
                projectId,
                title,
                issueKey,
                description,
                stateId,
                typeId,
                priorityId,
                assigneeId,
                reporterId,
                customData: customData || {}, // JSONB Fully parameterized
                version: 1
            },
            include: {
                state: true,
                assignee: { select: { id: true, name: true } }
            }
        });
        return res.status(201).json({ data: task });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createTask = createTask;
const updateTaskState = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const id = req.params.id;
        const { newStateId } = req.body;
        const task = await prisma_1.default.task.findFirst({ where: { id, tenantId } });
        if (!task)
            return res.status(404).json({ error: 'Task not found' });
        // Track Version logic
        const currentVersion = task.version;
        const updatedTask = await prisma_1.default.task.update({
            where: { id },
            data: {
                stateId: newStateId,
                version: currentVersion + 1
            }
        });
        // Broadcast to clients in the project room
        const io = require('../utils/socket').getIO();
        io.to(`project_${updatedTask.projectId}`).emit('task_updated', updatedTask);
        return res.json({ data: updatedTask });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.updateTaskState = updateTaskState;
