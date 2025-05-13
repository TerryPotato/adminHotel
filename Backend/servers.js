const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const outputFile = require('./swagger.json');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Inicializar Express
const app = express();

// Usar el puerto asignado por Render o el 8000 por defecto
const PORT = process.env.PORT || 8000;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(outputFile));

// Rutas API
app.use("/api/habitaciones", require("./routes/habitacionesRoutes"));
app.use("/api/reservaciones", require("./routes/reservacionesRoutes"));
app.use("/api/usuarios", require("./routes/userRoutes"));

// Ruta principal para comprobar funcionamiento
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`.yellow.bold);
});
