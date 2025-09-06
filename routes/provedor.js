import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todos os provedores
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id_provedor, provedor, status, client_id, secret FROM provedor');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar provedor por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_provedor, provedor, status, client_id, secret FROM provedor WHERE id_provedor = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provedor não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar provedor
router.post('/', authenticateToken, async (req, res) => {
  const { provedor, status, client_id, secret } = req.body;

  if (provedor === undefined || !status || !client_id || !secret) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO provedor (provedor, status, client_id, secret) VALUES ($1, $2, $3, $4) RETURNING *',
      [provedor, status, client_id, secret]
    );
    res.status(201).json({ message: 'Provedor criado', provedor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar provedor
router.put('/:id', authenticateToken, async (req, res) => {
  const { provedor, status, client_id, secret } = req.body;

  if (provedor === undefined || !status || !client_id || !secret) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'UPDATE provedor SET provedor=$1, status=$2, client_id=$3, secret=$4 WHERE id_provedor=$5 RETURNING *',
      [provedor, status, client_id, secret, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provedor não encontrado' });
    }

    res.json({ message: 'Provedor atualizado', provedor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar provedor
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM provedor WHERE id_provedor=$1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Provedor não encontrado' });
    }

    res.json({ message: 'Provedor deletado', provedor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;