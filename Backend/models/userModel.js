const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"]
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true, // No se permiten duplicados
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Users", userSchema);