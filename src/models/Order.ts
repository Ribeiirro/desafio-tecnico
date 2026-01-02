import mongoose, { Schema, Document, Model } from 'mongoose';

export enum OrderState {
    CREATED = 'CREATED',
    ANALYSIS = 'ANALYSIS',
    COMPLETED = 'COMPLETED',
}

export enum OrderStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
}

// Interface do Subdocumento
export interface IService {
    name: string;
    value: number;
    status: 'PENDING' | 'DONE';
}

// Interface do Documento
export interface IOrder extends Document {
    lab: string;
    patient: string;
    customer: string;
    state: OrderState;
    status: OrderStatus;
    services: IService[];
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    lab: { type: String, required: true },
    patient: { type: String, required: true },
    customer: { type: String, required: true },
    state: {
        type: String,
        enum: Object.values(OrderState),
        default: OrderState.CREATED
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.ACTIVE
    },
    services: {
        type: [{
            name: String,
            value: Number,
            status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' }
        }],
        required: true,
        // Validação nativa do Mongoose como fallback
        validate: [(val: IService[]) => val.length > 0, 'O pedido deve ter pelo menos um serviço.']
    }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);