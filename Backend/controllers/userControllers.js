const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        console.log('Usuario creado:', user); // Esto imprimirá el usuario creado en la terminal
    
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: 'Datos inválidos' });
        }
    } catch (error) {
        console.error(error); // Imprime el error en la terminal
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};

// Iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por email
        const user = await User.findOne({ email });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id) // Generar un token JWT
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' }); // Error de autenticación
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};

// Obtener el perfil del usuario
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
};

// Generar un token JWT
const generateToken = (id) => {
    if (!id) {
        throw new Error('El ID es undefined'); // Esto ayudará a depurar si el ID no se pasa correctamente
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = { registerUser, loginUser, getUserProfile };