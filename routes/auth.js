import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import TipoUsuario from '../models/enums.js';

const router = express.Router();

// Registrar usuário
router.post('/register', async (req, res) => {
  const { nome, usuario, senha, tipo } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, usuario, senha_hash, tipo) VALUES ($1, $2, $3, $4) RETURNING id_usuario',
      [nome, usuario, hashedPassword, tipo || 'comum']
    );
    res.json({ id: result.rows[0].id_usuario });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Usuário não encontrado" });
    
    const user = result.rows[0];
    const valid = await bcrypt.compare(senha, user.senha_hash);
    if (!valid) return res.status(401).json({ message: "Senha inválida" });

    const token = jwt.sign({ id: user.id_usuario, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;