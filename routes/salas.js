import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todas as salas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_sala, nome, descricao, id_fechadura FROM salas'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar sala por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_sala, nome, descricao, id_fechadura FROM salas WHERE id_sala = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar sala
router.post('/', authenticateToken, async (req, res) => {
  const { nome, descricao, id_fechadura } = req.body;

  if (!nome || !id_fechadura) {
    return res.status(400).json({ message: 'Os campos nome e id_fechadura são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO salas (nome, descricao, id_fechadura) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao || null, id_fechadura]
    );
    res.status(201).json({ message: 'Sala criada', sala: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar sala
router.put('/:id', authenticateToken, async (req, res) => {
  const { nome, descricao, id_fechadura } = req.body;

  if (!nome || !id_fechadura) {
    return res.status(400).json({ message: 'Os campos nome e id_fechadura são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'UPDATE salas SET nome=$1, descricao=$2, id_fechadura=$3 WHERE id_sala=$4 RETURNING *',
      [nome, descricao || null, id_fechadura, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }

    res.json({ message: 'Sala atualizada', sala: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar sala
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM salas WHERE id_sala=$1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala não encontrada' });
    }

    res.json({ message: 'Sala deletada', sala: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;