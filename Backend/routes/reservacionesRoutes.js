const express = require('express');
const router = express.Router();
const { getReservaciones, createReservacion, deleteReservacion, getReservacionById } = require('../controllers/reservacionesControllers');

// Obtener todas las reservaciones
router.get('/', getReservaciones);

// Obtener una reservación por ID
router.get('/:id', getReservacionById);

// Crear una nueva reservación
router.post('/', createReservacion);

// Eliminar una reservación por ID
router.delete('/:id', deleteReservacion);

module.exports = router;