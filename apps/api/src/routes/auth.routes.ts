import { Router } from 'express';
import { login, register, switchTenant } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/switch-tenant', authenticate, switchTenant);

export default router;
