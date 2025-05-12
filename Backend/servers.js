const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const cors = require('cors');

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 8000;

connectDB(); // Conectar a MongoDB

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Registrar rutas
app.use("/api/habitaciones", require("./routes/habitacionesRoutes"));
app.use("/api/reservaciones", require("./routes/reservacionesRoutes"));

// Ruta principal
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`.yellow.bold);
});
