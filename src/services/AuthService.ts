import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthDTO } from '../schemas/AuthSchema';

export class AuthService {

    async register(data: AuthDTO): Promise<IUser> {
        if (await User.findOne({ email: data.email })) {
            throw new Error('Usuário já existe.');
        }

        const hashedPassword = await bcrypt.hash(data.password, 8);

        const user = await User.create({
            email: data.email,
            password: hashedPassword
        });

        user.password = ''; // Oculta senha no retorno
        return user;
    }

    async login({ email, password }: AuthDTO) {
        const user = await User.findOne({ email }).select('+password');

        if (!user) throw new Error('Credenciais inválidas.');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Credenciais inválidas.'); 

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        user.password = '';
        return { user, token };
    }
}