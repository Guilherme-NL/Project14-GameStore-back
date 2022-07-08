import { signIn, signUp, logOut } from '../controllers/authController.js';
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.delete('/session',validateUser,logOut)

export default router;