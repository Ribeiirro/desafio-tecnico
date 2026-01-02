import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({ error: "Email e senha são obrigatórios." });
            }

            const user = await authService.register({ email, password });
            return res.status(201).json(user);

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });
            return res.json(result);

        } catch (error: any) {
            // Retorna 401 (Unauthorized) para erros de login
            return res.status(401).json({ error: error.message });
        }
    }
}