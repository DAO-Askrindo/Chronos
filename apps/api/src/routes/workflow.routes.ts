import { Router } from 'express';
import { getWorkflows, createWorkflow } from '../controllers/workflow.controller';
import { authenticate } from '../middlewares/auth';
// import { requirePermission } from '../middlewares/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getWorkflows);
// router.post('/', requirePermission('workflow:manage'), createWorkflow);
router.post('/', createWorkflow);

export default router;
