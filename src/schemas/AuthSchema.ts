import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(3, "Senha deve ter no mínimo 3 caracteres")
});

export type AuthDTO = z.infer<typeof authSchema>;