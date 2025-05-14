const asyncHandler = require('express-async-handler'); // Corregido nombre
const Reservaciones = require('../models/reservacionesModel');
const Habitaciones = require('../models/habitacionesModel');
const { createReadStream } = require('fs');

// Función para calcular el costo total
const calcularCostoTotal = (precioPorNoche, diaEntrada, diaSalida) => {
    const fechaEntrada = new Date(diaEntrada);
    const fechaSalida = new Date(diaSalida);
    const noches = Math.ceil((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24)); // Diferencia en días
    return precioPorNoche * noches;
};

// Obtener todas las reservaciones
const getReservaciones = asyncHandler(async (req, res) => {
    const reservaciones = await Reservaciones.find(); // Obtener todas las reservaciones
    res.status(200).json({ reservaciones }); // Devolver las reservaciones en formato JSON
});

// Crear una nueva reservación
const createReservacion = asyncHandler(async (req, res) => {
    const { nombre, apellidos, telefono, correo, noHabitacion, diaEntrada, diaSalida, horaEntrada, horaSalida, facturacion } = req.body;

    //Datos obligatorios
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

    // Calcular el costo total
    const costoTotal = calcularCostoTotal(habitacion.precio, diaEntrada, diaSalida);

    const reservaciones = await Reservaciones.create({
        nombre,
        apellidos,
        telefono,
        correo,
        noHabitacion,
        diaEntrada,
        diaSalida,
        horaEntrada,
        horaSalida,
        costoTotal,
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
const getReservacionById = asyncHandler(async (req, res) => {
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
const deleteReservacion = asyncHandler(async (req, res) => {
    const { id } = req.params;

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

// Actualizar una reservación por ID
const updateReservacion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, telefono, correo, noHabitacion, diaEntrada, diaSalida, horaEntrada, horaSalida, facturacion } = req.body;

    const reservacion = await Reservaciones.findById(id);
    if (!reservacion) {
        res.status(404);
        throw new Error("Reservación no encontrada");
    }

    const habitacionNueva = await Habitaciones.findOne({ numero: noHabitacion });
    if (!habitacionNueva) {
        res.status(404);
        throw new Error("Habitación no encontrada");
    }

    // Si cambió la habitación, liberar la anterior y ocupar la nueva
    if (reservacion.noHabitacion !== noHabitacion) {
        await Habitaciones.findOneAndUpdate(
            { numero: reservacion.noHabitacion },
            { disponibilidad: true }
        );
        await Habitaciones.findOneAndUpdate(
            { numero: noHabitacion },
            { disponibilidad: false }
        );
    }

    // Calcular costo total
    const costoTotal = calcularCostoTotal(habitacionNueva.precio, diaEntrada, diaSalida);

    const reservacionActualizada = await Reservaciones.findByIdAndUpdate(id, {
        nombre,
        apellidos,
        telefono,
        correo,
        noHabitacion,
        diaEntrada,
        diaSalida,
        horaEntrada,
        horaSalida,
        costoTotal,
        facturacion
    }, { new: true });

    res.status(200).json({
        mensaje: "Reservación actualizada correctamente",
        reservacion: reservacionActualizada
    });
});

module.exports = {
    getReservaciones,
    createReservacion,
    getReservacionById,
    deleteReservacion,
    updateReservacion
};
