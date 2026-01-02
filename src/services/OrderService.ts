import Order, { IOrder, OrderState, OrderStatus } from '../models/Order';
import { CreateOrderDTO } from '../schemas/OrderSchema';
import { FilterQuery } from 'mongoose';

export class OrderService {

    async create(data: CreateOrderDTO): Promise<IOrder> {
        const totalValue = data.services.reduce((acc, curr) => acc + curr.value, 0);

        if (totalValue <= 0) {
            throw new Error("O valor total do pedido não pode ser zerado.");
        }

        return await Order.create({
            ...data,
            state: OrderState.CREATED,
            status: OrderStatus.ACTIVE
        });
    }

    async findAll(page: number, limit: number, stateFilter?: string) {
        const query: FilterQuery<IOrder> = { status: OrderStatus.ACTIVE };

        if (stateFilter) {
            query.state = stateFilter as OrderState;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Order.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Order.countDocuments(query)
        ]);

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        };
    }

    async advanceState(id: string): Promise<IOrder> {
        const order = await Order.findById(id);
        if (!order) throw new Error("Pedido não encontrado.");

        const transitions: Record<string, OrderState> = {
            [OrderState.CREATED]: OrderState.ANALYSIS,
            [OrderState.ANALYSIS]: OrderState.COMPLETED
        };

        const nextState = transitions[order.state];

        if (!nextState) {
            throw new Error(`Não é possível avançar o status a partir de ${order.state}. Pedido já finalizado ou estado inválido.`);
        }

        order.state = nextState;
        return await order.save();
    }
}