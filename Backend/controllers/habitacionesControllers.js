const asyngHandler = require('express-async-handler');
const Habitaciones = require('../models/habitacionesModel');

const getHabitaciones = asyngHandler(async (req, res) => {
    const habitaciones = await Habitaciones.find();
    res.status(200).json({ habitaciones }); 
});

const createHabitacion = asyngHandler(async (req, res) => {
    const {numero, tipo ,precio} = req.body;
    if (!numero || !tipo || !precio) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    const habitacion = await Habitaciones.create({
        numero,
        tipo,
        precio
    });
    res.status(201).json({ 
        mensaje: "Habitacion creada",
        habitacion
    });
});

const updateHabitacion = asyngHandler(async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body); // Depuración

    const { numero, tipo, precio } = req.body;

    if (!numero || !tipo || !precio) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    // Busca la habitación por número
    const habitacion = await Habitaciones.findOne({ numero });
    if (!habitacion) {
        res.status(404);
        throw new Error("Habitación no encontrada");
    }

    // Actualiza los datos de la habitación
    habitacion.tipo = tipo;
    habitacion.precio = precio;

    const habitacionActualizada = await habitacion.save();

    res.status(200).json({
        mensaje: `Habitación con número ${numero} actualizada`,
        habitacion: habitacionActualizada
    });
});

const deleteHabitacion = asyngHandler(async (req, res) => {
    const {numero} = req.body;
    if (!numero) {
        res.status(400);
        throw new Error("Por favor proporciona un número de habitación");
    }
    //Busca la habitacion y elimina
    const habitacionEliminada = await Habitaciones.findOneAndDelete({ numero });
    if (!habitacionEliminada) {
        res.status(404);
        throw new Error("Habitacion no encontrada");
    }

    res.status(200).json({ mensaje: `Habitacion con numero ${numero} eliminada` });
});

module.exports = {
    getHabitaciones,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion
};