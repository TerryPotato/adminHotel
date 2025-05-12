const asyngHandler = require('express-async-handler');
const Reservaciones = require('../models/reservacionesModel');
const Habitaciones = require('../models/habitacionesModel'); // Importar el modelo Habitaciones
const { createReadStream } = require('fs');

// Obtener todas las reservaciones
const getReservaciones = asyngHandler(async (req, res) => {
    const reservaciones = await Reservaciones.find(); // Obtener todas las reservaciones
    res.status(200).json({ reservaciones }); // Devolver las reservaciones en formato JSON
});

const createReservacion = asyngHandler(async (req, res) => {
    const { nombre, apellidos, telefono, correo, noHabitacion, diaEntrada, diaSalida, horaEntrada, horaSalida, facturacion } = req.body;

    if (!nombre || !apellidos || !telefono || !noHabitacion || !diaEntrada || !diaSalida || !horaEntrada || !horaSalida) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    // Obtener el precio de la habitación
    const habitacion = await Habitaciones.findOne({ numero: noHabitacion });
    if (!habitacion) {
        res.status(404);
        throw new Error("Habitación no encontrada");
    }

    // Calcular el costo total (ejemplo: precio por noche * número de noches)
    const fechaEntrada = new Date(diaEntrada);
    const fechaSalida = new Date(diaSalida);
    const noches = Math.ceil((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24)); // Diferencia en días
    const costoTotal = habitacion.precio * noches;

    const reservaciones = await Reservaciones.create({
        nombre,
        apellidos,
        telefono,
        correo, // Incluir el correo
        noHabitacion,
        diaEntrada,
        diaSalida,
        horaEntrada,
        horaSalida,
        costoTotal, // Incluir el costo total
        facturacion
    });

    // Actualizar la disponibilidad de la habitación
    await Habitaciones.findOneAndUpdate(
        { numero: noHabitacion },
        { disponibilidad: false }
    );

    res.status(201).json({
        mensaje: "Reservación creada exitosamente",
        reservaciones
    });
});

// Obtener una reservación por ID
const getReservacionById = asyngHandler(async (req, res) => {
    const { id } = req.params;

    // Buscar la reservación por ID
    const reservacion = await Reservaciones.findById(id);

    if (!reservacion) {
        res.status(404);
        throw new Error("Reservación no encontrada");
    }

    res.status(200).json(reservacion);
});

// Eliminar una reservación por ID
const deleteReservacion = asyngHandler(async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido para eliminar:", id); // Depuración

    const reservacionEliminada = await Reservaciones.findByIdAndDelete(id);

    if (!reservacionEliminada) {
        res.status(404);
        throw new Error("Reservación no encontrada");
    }

    await Habitaciones.findOneAndUpdate(
        { numero: reservacionEliminada.noHabitacion },
        { disponibilidad: true }
    );

    res.status(200).json({ mensaje: `Reservación con ID ${id} eliminada exitosamente` });
});

module.exports = {
    getReservaciones,
    createReservacion,
    getReservacionById,
    deleteReservacion
};