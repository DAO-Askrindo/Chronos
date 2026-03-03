"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflow = exports.getWorkflows = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getWorkflows = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        // Sort workflows by orderIndex so Kanban columns appear correctly
        const workflows = await prisma_1.default.workflowState.findMany({
            where: { tenantId },
            orderBy: { orderIdx: 'asc' }
        });
        return res.json({ data: workflows });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getWorkflows = getWorkflows;
const createWorkflow = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const { name, category, color, orderIdx } = req.body;
        const workflow = await prisma_1.default.workflowState.create({
            data: {
                tenantId,
                name,
                category, // IN_PROGRESS, DONE, TODO
                color,
                orderIdx
            }
        });
        return res.status(201).json({ data: workflow });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createWorkflow = createWorkflow;
