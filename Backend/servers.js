const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const cors = require('cors');

dotenv.config(); // Carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 8000;

connectDB(); // Conectar a MongoDB

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de rutas
app.use("/api/habitaciones", require("./routes/habitacionesRoutes"));
app.use("/api/reservaciones", require("./routes/reservacionesRoutes"));

// Ruta principal
app.get("/", (req, res) => {
  res.send("API is running...");
});

// **Corrección: Solo una llamada a app.listen**
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`.yellow.bold);
});
