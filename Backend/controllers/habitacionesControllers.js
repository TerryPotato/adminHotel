const asyncHandler = require('express-async-handler');
const Habitaciones = require('../models/habitacionesModel');

const getHabitaciones = asyncHandler(async (req, res) => {
    const habitaciones = await Habitaciones.find().sort({ numero: 1 });
    res.status(200).json({ habitaciones }); 
});



const createHabitacion = asyncHandler(async (req, res) => {
    const { numero, tipo, precio } = req.body;

    // Validación de campos obligatorios
    if (!numero || !tipo || !precio) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    // Validar si la habitación con el mismo número ya existe
    const habitacionExistente = await Habitaciones.findOne({ numero });
    if (habitacionExistente) {
        res.status(400);
        throw new Error("Ya existe una habitación con ese número");
    }

    // Crear la habitación
    const habitacion = await Habitaciones.create({
        numero,
        tipo,
        precio
    });

    res.status(201).json({
        mensaje: "Habitación creada",
        habitacion
    });
});


const updateHabitacion = asyncHandler(async (req, res) => {
    console.log("Datos recibidos en el backend:", req.body); // Depuración

    const { numero, tipo, precio } = req.body;

    // Validación de campos obligatorios
    if (!numero || !tipo || !precio) {
        res.status(400);
        throw new Error("Por favor, completa todos los campos obligatorios");
    }

    // Verificar si la habitación existe
    const habitacion = await Habitaciones.findOne({ numero });
    if (!habitacion) {
        res.status(404);
        throw new Error("Habitación no encontrada");
    }

    // Verificar si hay otra habitación con el mismo número
    const habitacionExistente = await Habitaciones.findOne({ numero });
    if (habitacionExistente && habitacionExistente._id.toString() !== habitacion._id.toString()) {
        res.status(400);
        throw new Error("Ya existe una habitación con ese número");
    }

    // Actualizar los datos de la habitación
    habitacion.tipo = tipo;
    habitacion.precio = precio;

    const habitacionActualizada = await habitacion.save();

    res.status(200).json({
        mensaje: `Habitación con número ${numero} actualizada`,
        habitacion: habitacionActualizada
    });
});


const deleteHabitacion = asyncHandler(async (req, res) => {
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

const getHabitacionesOcupadas = async (req, res) => {
    try {
        const habitaciones = await Habitaciones.find({ disponibilidad: false });
        res.status(200).json(habitaciones); // aunque esté vacío, responde 200
    } catch (error) {
        console.error("Error al obtener habitaciones ocupadas:", error);
        res.status(500).json({ message: "Error al obtener las habitaciones ocupadas" });
    }
};


const checkoutHabitacion = asyncHandler(async (req, res) => {
    const { numero } = req.params;

    // Buscar la habitación por número
    const habitacion = await Habitaciones.findOne({ numero });
    if (!habitacion) {
        res.status(404);
        throw new Error("Habitación no encontrada");
    }

    // Actualizar la disponibilidad a true
    habitacion.disponibilidad = true;
    await habitacion.save();

    res.status(200).json({ mensaje: `Check-out realizado para la habitación ${numero}` });
});

module.exports = {
    getHabitaciones,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion,
    getHabitacionesOcupadas,
    checkoutHabitacion
};