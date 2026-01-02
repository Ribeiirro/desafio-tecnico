import { z } from 'zod';

// Enum do Zod deve bater com o do Mongoose
const OrderStateEnum = z.enum(['CREATED', 'ANALYSIS', 'COMPLETED']);
const OrderStatusEnum = z.enum(['ACTIVE', 'DELETED']);
const ServiceStatusEnum = z.enum(['PENDING', 'DONE']);

export const createOrderSchema = z.object({
    lab: z.string().min(1, "Laboratório é obrigatório"),
    patient: z.string().min(1, "Paciente é obrigatório"),
    customer: z.string().min(1, "Cliente é obrigatório"),
    services: z.array(
        z.object({
            name: z.string().min(1, "Nome do serviço obrigatório"),
            value: z.number().positive("Valor deve ser positivo"),
            status: ServiceStatusEnum.default('PENDING') // padrão PENDING
        })
    ).min(1, "O pedido deve ter pelo menos um serviço.")
});

// Extrai o tipo a partir do schema (Inferência)
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

// Schema para filtros de listagem
export const listOrderSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
    state: OrderStateEnum.optional()
});