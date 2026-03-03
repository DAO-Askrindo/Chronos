"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized. Missing or invalid token format.' });
        }
        const token = authHeader.split(' ')[1];
        const payload = (0, jwt_1.verifyToken)(token);
        if (!payload) {
            return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Unauthorized. User inactive or deleted.' });
        }
        req.user = user;
        req.activeTenantId = payload.activeTenantId;
        next();
    }
    catch (error) {
        return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
};
exports.authenticate = authenticate;
