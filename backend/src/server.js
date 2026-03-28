import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

connectDB();

app.use(cors())
app.use(express.json());

app.use('/api/users', userRoutes)

app.get( '/', (req, res) => {
    res.send('API da Pokédex Rodando! 🚀');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor voando na porta ${PORT}`);
});