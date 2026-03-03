"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchTenant = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { tenantName, userName, email, password } = req.body;
        // 1. Check if email exists
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ error: 'Email already exists' });
        // 2. Hash Password
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        // 3. Create Tenant, User, and Default Admin Role in a Transaction
        const result = await prisma_1.default.$transaction(async (tx) => {
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
        const token = (0, jwt_1.generateToken)({ userId: result.user.id, activeTenantId: result.tenant.id });
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid credentials or inactive user' });
        }
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id, activeTenantId: user.tenantId });
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.login = login;
const switchTenant = async (req, res) => {
    // To be implemented: Validate if user has access to targetTenantId
    res.status(501).json({ message: 'Not Implemented Yet' });
};
exports.switchTenant = switchTenant;
