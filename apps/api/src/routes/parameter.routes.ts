import { Router } from 'express';
import { getSystemParameters, createSystemParameter } from '../controllers/parameter.controller';
import { authenticate } from '../middlewares/auth';
// import { requirePermission } from '../middlewares/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getSystemParameters);
// router.post('/', requirePermission('parameter:manage'), createSystemParameter);
router.post('/', createSystemParameter);

export default router;
