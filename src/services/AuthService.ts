import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AuthDTO {
    email: string;
    password: string;
}

export class AuthService {

    // Registro de Usuário
    async register(data: AuthDTO): Promise<IUser> {
        const { email, password } = data;

        // Verifica duplicidade
        if (await User.findOne({ email })) {
            throw new Error('Usuário já existe.');
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 8);

        // Cria usuário
        const user = await User.create({
            email,
            password: hashedPassword
        });

        // Remove a senha do objeto retornado (apenas visualmente para o retorno)
        user.password = undefined as any;

        return user;
    }

    // Login
    async login({ email, password }: AuthDTO) {
        // Busca usuário e força o retorno do campo password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        // Compara senha enviada com o hash do banco
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Senha inválida.');
        }

        // Gera o Token JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' } 
            // Token expira em 1 dia
        );

        // Remove senha do objeto de retorno
        user.password = undefined as any;

        return { user, token };
    }
}