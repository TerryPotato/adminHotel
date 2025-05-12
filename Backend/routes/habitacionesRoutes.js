const express = require('express');
const router = express.Router();
const { getHabitaciones, createHabitacion, updateHabitacion, deleteHabitacion, getHabitacionesOcupadas, checkoutHabitacion } = require('../controllers/habitacionesControllers');
const Habitaciones = require('../models/habitacionesModel');

// Obtenemos las habitaciones
router.get('/', getHabitaciones);
// Creamos una habitación
router.post('/', createHabitacion);
// Modificamos la disponibilidad de una habitación
router.put('/', updateHabitacion);
// Eliminamos una habitación
router.delete('/', deleteHabitacion);


// Obtener habitaciones disponibles con su precio
router.get('/disponibles', async (req, res) => {
    try {
        const habitaciones = await Habitaciones.find({ disponibilidad: true }, 'numero precio');
        res.status(200).json(habitaciones);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener habitaciones disponibles" });
    }
});

// Ruta para obtener habitaciones ocupadas
router.get('/ocupadas', getHabitacionesOcupadas);

router.put('/:numero/checkout', checkoutHabitacion);

router.get('/:numero', async (req, res) => {
    const { numero } = req.params;

    try {
        const habitacion = await Habitaciones.findOne({ numero });
        if (!habitacion) {
            return res.status(404).json({ message: "Habitación no encontrada" });
        }
        res.status(200).json(habitacion);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la habitación" });
    }
});

module.exports = router;