import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { authSchema } from '../schemas/AuthSchema';
import { ZodError } from 'zod';

const authService = new AuthService();

export class AuthController {

    async register(req: Request, res: Response) {
        try {
            const validatedData = authSchema.parse(req.body);
            const user = await authService.register(validatedData);
            return res.status(201).json(user);

        } catch (error: unknown) {
            return AuthController.handleError(res, error);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const validatedData = authSchema.parse(req.body);
            const result = await authService.login(validatedData);
            return res.json(result);

        } catch (error: unknown) {
            return AuthController.handleError(res, error);
        }
    }

    private static handleError(res: Response, error: unknown) {
        if (error instanceof ZodError) {
            return res.status(400).json({ errors: error.issues });
        }

        if (error instanceof Error) {
            return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno" });
    }
}