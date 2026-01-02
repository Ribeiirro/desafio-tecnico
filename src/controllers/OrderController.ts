import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { createOrderSchema, listOrderSchema } from '../schemas/OrderSchema';
import { ZodError } from 'zod';

const orderService = new OrderService();

export class OrderController {

    async create(req: Request, res: Response) {
        try {
            // 1. Validação Zod
            const validatedData = createOrderSchema.parse(req.body);

            // 2. Service
            const order = await orderService.create(validatedData);
            return res.status(201).json(order);

        } catch (error: unknown) {
            return OrderController.handleError(res, error);
        }
    }

    async list(req: Request, res: Response) {
        try {
            // Valida query params com Zod (converte strings para numbers)
            const { page, limit, state } = listOrderSchema.parse(req.query);

            const result = await orderService.findAll(page, limit, state);
            return res.json(result);

        } catch (error: unknown) {
            return OrderController.handleError(res, error);
        }
    }

    async advance(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const order = await orderService.advanceState(id);
            return res.json(order);

        } catch (error: unknown) {
            return OrderController.handleError(res, error);
        }
    }

    // Método helper privado e estático para padronizar erros
    private static handleError(res: Response, error: unknown) {
        if (error instanceof ZodError) {
        
            return res.status(400).json({ errors: error.issues });
        }

        if (error instanceof Error) {
            const status = error.message === "Pedido não encontrado." ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }

        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}