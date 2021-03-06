import { listProducts, displayProduct } from '../controllers/productController.js';
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.get('/products', listProducts);
router.get('/products/:productId', displayProduct);

export default router;