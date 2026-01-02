import { Router, Request, Response } from 'express';
import { AuthController } from './controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API Backend rodando!' });
});

// Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;