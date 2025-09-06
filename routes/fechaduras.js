import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todas as fechaduras
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_fechadura, id_provedor, chave_dispositivo FROM fechaduras'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar fechadura por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_fechadura, id_provedor, chave_dispositivo FROM fechaduras WHERE id_fechadura = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fechadura não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar fechadura
router.post('/', authenticateToken, async (req, res) => {
  const { id_provedor, chave_dispositivo } = req.body;

  if (!id_provedor || !chave_dispositivo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO fechaduras (id_provedor, chave_dispositivo) VALUES ($1, $2) RETURNING *',
      [id_provedor, chave_dispositivo]
    );
    res.status(201).json({ message: 'Fechadura criada', fechadura: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar fechadura
router.put('/:id', authenticateToken, async (req, res) => {
  const { id_provedor, chave_dispositivo } = req.body;

  if (!id_provedor || !chave_dispositivo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'UPDATE fechaduras SET id_provedor=$1, chave_dispositivo=$2 WHERE id_fechadura=$3 RETURNING *',
      [id_provedor, chave_dispositivo, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fechadura não encontrada' });
    }

    res.json({ message: 'Fechadura atualizada', fechadura: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar fechadura
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM fechaduras WHERE id_fechadura=$1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fechadura não encontrada' });
    }

    res.json({ message: 'Fechadura deletada', fechadura: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;