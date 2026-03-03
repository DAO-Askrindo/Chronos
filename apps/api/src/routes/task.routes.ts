import { Router } from 'express';
import { getTasks, createTask, updateTaskState } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/state', updateTaskState);

export default router;
