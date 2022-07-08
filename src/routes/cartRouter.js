import { addToCart, getCart  } from '../controllers/cartController.js';
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.post('/cart', validateUser, addToCart);
router.get('/cart/',validateUser, getCart);

export default router;