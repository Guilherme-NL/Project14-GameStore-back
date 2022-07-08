import { postToHistory,listHistory  } from '../controllers/historyController.js';
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.post('/history', validateUser, postToHistory);
router.get('/history/:userId',validateUser, listHistory);

export default router;