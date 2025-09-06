import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar todas as reservas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_reserva, id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status FROM reservas'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar reserva por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_reserva, id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status FROM reservas WHERE id_reserva = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Criar reserva
router.post('/', authenticateToken, async (req, res) => {
  const { id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status } = req.body;

  if (!id_usuario || !id_sala || !data_reserva_inicial || !data_reserva_final || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO reservas (id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status]
    );
    res.status(201).json({ message: 'Reserva criada', reserva: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar reserva
router.put('/:id', authenticateToken, async (req, res) => {
  const { id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status } = req.body;

  if (!id_usuario || !id_sala || !data_reserva_inicial || !data_reserva_final || !status) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'UPDATE reservas SET id_usuario=$1, id_sala=$2, data_reserva_inicial=$3, data_reserva_final=$4, status=$5 WHERE id_reserva=$6 RETURNING *',
      [id_usuario, id_sala, data_reserva_inicial, data_reserva_final, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json({ message: 'Reserva atualizada', reserva: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar reserva
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM reservas WHERE id_reserva=$1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json({ message: 'Reserva deletada', reserva: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;