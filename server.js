import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import usuarioRoutes from './routes/usuarios.js';
import salaRoutes from './routes/salas.js';
import reservaRoutes from './routes/reservas.js';
import provedorRoutes from './routes/provedor.js';
import fechadurasRoutes from './routes/fechaduras.js';

dotenv.config();
const app = express();

app.use(express.json());

// Servir frontend estático
app.use(express.static("public"));

// Rotas
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/salas', salaRoutes);
app.use('/reservas', reservaRoutes);
app.use('/provedor', provedorRoutes);
app.use('/fechaduras', fechadurasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));