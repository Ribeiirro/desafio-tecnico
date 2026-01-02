import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';

const orderService = new OrderService();

export class OrderController {

    async create(req: Request, res: Response) {
        try {
            const order = await orderService.create(req.body);
            return res.status(201).json(order);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const state = req.query.state as string;

            const result = await orderService.findAll(page, limit, state);
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async advance(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const order = await orderService.advanceState(id);
            return res.json(order);
        } catch (error: any) {
            const status = error.message === "Pedido não encontrado." ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }
    }
}