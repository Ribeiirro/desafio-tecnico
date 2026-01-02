import { Router, Request, Response } from 'express';
import { OrderController } from './controllers/OrderController';
import { AuthController } from './controllers/AuthController';
import { authMiddleware } from './middlewares/auth';

const router = Router();
const orderController = new OrderController();
const authController = new AuthController();

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API Backend rodando!' });
});

// Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Privadas
router.use('/orders', authMiddleware);

router.post('/orders', orderController.create);
router.get('/orders', orderController.list);
router.patch('/orders/:id/advance', orderController.advance);

export default router;