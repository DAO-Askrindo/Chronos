"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystemParameter = exports.getSystemParameters = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSystemParameters = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const category = req.query.category;
        // Allow filtering by parameter category (e.g. 'ISSUE_TYPE', 'PRIORITY')
        const whereClause = { tenantId, isActive: true };
        if (category) {
            whereClause.category = category;
        }
        const parameters = await prisma_1.default.systemParameter.findMany({
            where: whereClause
        });
        return res.json({ data: parameters });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getSystemParameters = getSystemParameters;
const createSystemParameter = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const { category, label, value, color } = req.body;
        const parameter = await prisma_1.default.systemParameter.create({
            data: {
                tenantId,
                category,
                label,
                value,
                color
            }
        });
        return res.status(201).json({ data: parameter });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createSystemParameter = createSystemParameter;
