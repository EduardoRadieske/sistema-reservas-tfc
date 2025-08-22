import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todos
router.get('/', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT id_usuario, nome, email, tipo FROM usuarios');
  res.json(result.rows);
});

// Buscar por ID
router.get('/:id', authenticateToken, async (req, res) => {
  const result = await pool.query('SELECT id_usuario, nome, email, tipo FROM usuarios WHERE id_usuario = $1', [req.params.id]);
  res.json(result.rows[0]);
});

// Atualizar
router.put('/:id', authenticateToken, async (req, res) => {
  const { nome, email, tipo } = req.body;
  await pool.query('UPDATE usuarios SET nome=$1, email=$2, tipo=$3 WHERE id_usuario=$4', [nome, email, tipo, req.params.id]);
  res.json({ message: "Usuário atualizado" });
});

// Deletar
router.delete('/:id', authenticateToken, async (req, res) => {
  await pool.query('DELETE FROM usuarios WHERE id_usuario=$1', [req.params.id]);
  res.json({ message: "Usuário deletado" });
});

export default router;