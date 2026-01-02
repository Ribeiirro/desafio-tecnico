import Order, { IOrder, OrderState, OrderStatus } from '../models/Order';

interface CreateOrderDTO {
    lab: string;
    patient: string;
    customer: string;
    services: { name: string; value: number }[];
}

export class OrderService {

    async create(data: CreateOrderDTO): Promise<IOrder> {
        const totalValue = data.services.reduce((acc, curr) => acc + curr.value, 0);

        if (totalValue <= 0) {
            throw new Error("O valor total do pedido não pode ser zerado.");
        }

        if (data.services.length === 0) {
            throw new Error("O pedido deve conter serviços.");
        }

        return await Order.create({
            ...data,
            state: OrderState.CREATED,
            status: OrderStatus.ACTIVE
        });
    }

    // Listagem com Paginação e Filtros
    async findAll(page: number, limit: number, stateFilter?: string) {
        const query: any = { status: OrderStatus.ACTIVE };

        if (stateFilter) {
            query.state = stateFilter;
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            Order.find(query).skip(skip).limit(limit),
            Order.countDocuments(query)
        ]);

        return { data, total, page, pages: Math.ceil(total / limit) };
    }

    // Lógica de Transição de Estado Estrita
    async advanceState(id: string): Promise<IOrder> {
        const order = await Order.findById(id);
        if (!order) throw new Error("Pedido não encontrado.");

        const currentState = order.state;
        let nextState: OrderState | null = null;

        // Máquina de Estados
        switch (currentState) {
            case OrderState.CREATED:
                nextState = OrderState.ANALYSIS;
                break;
            case OrderState.ANALYSIS:
                nextState = OrderState.COMPLETED;
                break;
            case OrderState.COMPLETED:
                throw new Error("O pedido já está finalizado.");
            default:
                throw new Error("Estado inválido.");
        }

        order.state = nextState;
        return await order.save();
    }
}