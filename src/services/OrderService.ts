import Order, { IOrder, OrderState, OrderStatus } from '../models/Order';
import { CreateOrderDTO, UpdateOrderDTO } from '../schemas/OrderSchema';
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

    async update(id: string, data: UpdateOrderDTO): Promise<IOrder> {
        const order = await Order.findById(id);

        if (!order) {
            throw new Error("Pedido não encontrado.");
        }

        // Regra: Não permitir editar pedidos finalizados ou deletados
        if (order.state === OrderState.COMPLETED || order.status === OrderStatus.DELETED) {
            throw new Error("Não é possível alterar dados de um pedido finalizado ou excluído.");
        }

        // Atualiza apenas os campos permitidos
        if (data.lab) order.lab = data.lab;
        if (data.patient) order.patient = data.patient;
        if (data.customer) order.customer = data.customer;

        return await order.save();
    }

    async advanceState(id: string): Promise<IOrder> {
        const order = await Order.findById(id);

        if (!order) {
            throw new Error("Pedido não encontrado.");
        }

        // Definição Estrita da Máquina de Estados
        // Chave: Estado Atual -> Valor: Próximo Estado Permitido
        const stateMachine: Partial<Record<OrderState, OrderState>> = {
            [OrderState.CREATED]: OrderState.ANALYSIS,
            [OrderState.ANALYSIS]: OrderState.COMPLETED
        };

        const nextState = stateMachine[order.state];

        // Se não houver próximo estado mapeado, a transição é inválida
        if (!nextState) {
            if (order.state === OrderState.COMPLETED) {
                throw new Error("O pedido já está finalizado (COMPLETED).");
            }
            throw new Error(`Transição inválida: Não é possível avançar a partir de ${order.state}.`);
        }

        order.state = nextState;
        return await order.save();
    }
}