"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_1 = require("../middlewares/auth");
// import { requirePermission } from '../middlewares/rbac';
const router = (0, express_1.Router)();
// Apply Auth Middleware to all routes here
router.use(auth_1.authenticate);
router.get('/', project_controller_1.getProjects);
// router.post('/', requirePermission('project:create'), createProject);
router.post('/', project_controller_1.createProject);
exports.default = router;
