import { Router } from 'express';
import { getProjects, createProject } from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth';
// import { requirePermission } from '../middlewares/rbac';

const router = Router();

// Apply Auth Middleware to all routes here
router.use(authenticate);

router.get('/', getProjects);
// router.post('/', requirePermission('project:create'), createProject);
router.post('/', createProject);

export default router;
