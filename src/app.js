// src/app.js

require("dotenv").config(); // Carga las variables de entorno
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
// DB INSTANCE
const connectDB = require("./utils/mongo");
// ROUTES
const authRoutes = require("./routes/auth.routes");
const educationalInstitution = require("./routes/educationalInstitution.routes");
const groupRoutes = require("./routes/groups.routes");
const roomRoutes = require("./routes/rooms.routes");
const userRoutes = require("./routes/user.routes");
//CONFIG
dotenv.config();
connectDB();

// Configura CORS para permitir solo tu frontend
const corsOptions = {
  origin: "http://localhost:3003", // Cambia esto por la URL de tu frontend de React o Vue
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware para procesar JSON en las solicitudes
app.use(express.json());

// DEFINE ROUTES V1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/educationalInstitution", educationalInstitution);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/users", userRoutes);

//RUN SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
