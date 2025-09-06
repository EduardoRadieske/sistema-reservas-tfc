import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id_usuario, nome, usuario, tipo FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id_usuario, nome, usuario, tipo FROM usuarios WHERE id_usuario = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar
router.put('/:id', authenticateToken, async (req, res) => {

  const { nome, usuario, tipo } = req.body;
  try {
    await pool.query('UPDATE usuarios SET nome=$1, usuario=$2, tipo=$3 WHERE id_usuario=$4', [nome, usuario, tipo, req.params.id]);
    res.json({ message: "Usuário atualizado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id_usuario=$1', [req.params.id]);
    res.json({ message: "Usuário deletado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;