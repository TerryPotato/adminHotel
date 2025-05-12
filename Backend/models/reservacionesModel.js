const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const reservacionesSchema = mongoose.Schema(
    {
        nombre: { type: String, required: true },
        apellidos: { type: String, required: true },
        telefono: { type: String, required: true },
        correo: { type: String }, // Campo opcional
        noHabitacion: { type: Number, required: true },
        diaEntrada: { type: String, required: true },
        diaSalida: { type: String, required: true },
        horaEntrada: { type: String, required: true },
        horaSalida: { type: String, required: true },
        costoTotal: { type: Number, required: true },
        facturacion: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Reservaciones', reservacionesSchema, 'Reservaciones');