import { Router } from 'express';
import { getMeetings, createMeeting, updateRSVP } from '../controllers/meeting.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getMeetings);
router.post('/', createMeeting);
router.patch('/:id/rsvp', updateRSVP);

export default router;
