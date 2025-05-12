const mongoose = require('mongoose');

const habitacionesSchema = mongoose.Schema({ 
    nombre: {
        type : String,
        required: [true, "El nombre es obligatorio"]
    },
    apellido: {
        type : String,
        required: [true, "El apellido es obligatorio"]
    },
    telefono: {
        type : String,
        required: [true, "El numero es obligatorio"]
    },
    correo: {
        type : String,
        required: [false]
    },
},{
    timestamps: true
});

module.exports = mongoose.model("Huespedes", huepedesSchema, `Huespedes`);