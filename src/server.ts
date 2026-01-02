import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from './app';

// Carrega as variáveis
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

console.log('------------------------');
console.log('Valor do MONGO_URI:', MONGO_URI);
console.log('Tipo da variável:', typeof MONGO_URI);
console.log('------------------------');
// ----------------------------------------

if (!MONGO_URI || MONGO_URI === '') {
    console.error('Erro Fatal: MONGO_URI não está definido no arquivo .env');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Conectado');
        app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
    })
    .catch((err) => console.error('Erro MongoDB:', err));