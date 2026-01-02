import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../services/OrderService';
import Order, { OrderState, OrderStatus } from '../models/Order';

/*_______________________________________________________*/ 
                    // NOTA
                    // TESTES GERADOS COM AUXILIO DE IA
                    //José Ribeiro - 02/01/2026
/*_______________________________________________________*/ 

// Mock do Mongoose para não conectar no banco de verdade
vi.mock('../models/Order');

describe('OrderService Business Rules', () => {
    let orderService: OrderService;

    beforeEach(() => {
        orderService = new OrderService();
        vi.clearAllMocks(); // Limpa os mocks antes de cada teste
    });

    // --- TESTES DE CRIAÇÃO (POST) ---
    describe('create()', () => {
        it('deve criar um pedido com sucesso e status inicial correto', async () => {
            // CORREÇÃO: Adicionado o status 'PENDING' nos serviços para satisfazer o TypeScript
            const mockData = {
                lab: 'Lab Test',
                patient: 'John Doe',
                customer: 'Clinic A',
                services: [{
                    name: 'Exame A',
                    value: 100,
                    status: 'PENDING' as const // <--- Adicionado aqui
                }]
            };

            // Simula o retorno do Mongoose
            (Order.create as any).mockResolvedValue({
                ...mockData,
                state: OrderState.CREATED,
                status: OrderStatus.ACTIVE,
                _id: 'new_id'
            });

            const result = await orderService.create(mockData);

            expect(result).toHaveProperty('_id', 'new_id');
            expect(result.state).toBe(OrderState.CREATED);
            expect(result.status).toBe(OrderStatus.ACTIVE);
            expect(Order.create).toHaveBeenCalledTimes(1);
        });

        it('deve lançar erro se o valor total for zero ou negativo', async () => {
            const mockData = {
                lab: 'Lab Test',
                patient: 'John Doe',
                customer: 'Clinic A',
                services: [{
                    name: 'Exame Grátis',
                    value: 0,
                    status: 'PENDING' as const 
                }]
            };

            await expect(orderService.create(mockData))
                .rejects
                .toThrow("O valor total do pedido não pode ser zerado.");

            expect(Order.create).not.toHaveBeenCalled();
        });
    });

    // --- TESTES DE MÁQUINA DE ESTADOS (PATCH) ---
    describe('advanceState()', () => {
        it('deve avançar de CREATED para ANALYSIS', async () => {
            const mockOrder = {
                _id: '123',
                state: OrderState.CREATED,
                save: vi.fn().mockResolvedValue({ state: OrderState.ANALYSIS })
            };
            (Order.findById as any).mockResolvedValue(mockOrder);

            const result = await orderService.advanceState('123');

            expect(mockOrder.state).toBe(OrderState.ANALYSIS);
            expect(mockOrder.save).toHaveBeenCalled();
        });

        it('deve avançar de ANALYSIS para COMPLETED', async () => {
            const mockOrder = {
                _id: '123',
                state: OrderState.ANALYSIS,
                save: vi.fn().mockResolvedValue({ state: OrderState.COMPLETED })
            };
            (Order.findById as any).mockResolvedValue(mockOrder);

            const result = await orderService.advanceState('123');

            expect(mockOrder.state).toBe(OrderState.COMPLETED);
            expect(mockOrder.save).toHaveBeenCalled();
        });

        it('deve bloquear avanço se já estiver COMPLETED', async () => {
            const mockOrder = {
                _id: '123',
                state: OrderState.COMPLETED,
                save: vi.fn()
            };
            (Order.findById as any).mockResolvedValue(mockOrder);

            await expect(orderService.advanceState('123'))
                .rejects
                .toThrow("O pedido já está finalizado (COMPLETED).");
        });

        it('deve lançar erro se o pedido não existir', async () => {
            (Order.findById as any).mockResolvedValue(null);

            await expect(orderService.advanceState('999'))
                .rejects
                .toThrow("Pedido não encontrado.");
        });
    });

    // --- TESTES DE ATUALIZAÇÃO (PUT) ---
    describe('update()', () => {
        it('deve atualizar dados cadastrais de um pedido ativo', async () => {
            const mockOrder = {
                _id: '123',
                state: OrderState.CREATED,
                status: OrderStatus.ACTIVE,
                patient: 'Old Name',
                save: vi.fn().mockResolvedValue(true)
            };
            (Order.findById as any).mockResolvedValue(mockOrder);

            await orderService.update('123', { patient: 'New Name' });

            expect(mockOrder.patient).toBe('New Name');
            expect(mockOrder.save).toHaveBeenCalled();
        });

        it('deve impedir edição de pedido FINALIZADO', async () => {
            const mockOrder = {
                _id: '123',
                state: OrderState.COMPLETED, // Travado
                status: OrderStatus.ACTIVE,
                save: vi.fn()
            };
            (Order.findById as any).mockResolvedValue(mockOrder);

            await expect(orderService.update('123', { patient: 'New Name' }))
                .rejects
                .toThrow("Não é possível alterar dados de um pedido finalizado ou excluído.");

            expect(mockOrder.save).not.toHaveBeenCalled();
        });
    });
});