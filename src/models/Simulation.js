const mongoose = require("mongoose");

const SimulationSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardiotographyData: [
      {
        time: { type: Date, required: true },
        fetalHeartRate: Number, // latido fetal
        uterineContraction: Number, // contracción
        notes: String,
      },
    ], // datos registrados en la simulación
    actions: [
      {
        timestamp: { type: Date, default: Date.now },
        type: String, // ej: "INTERVENTION", "NOTE", "ADJUST_DEVICE"
        description: String,
      },
    ],
    evaluation: {
      score: Number, // calificación asignada por profesor/observador
      feedback: String,
    },
  },
  { timestamps: true, collection: "simulations" }
);

module.exports = mongoose.model("Simulation", SimulationSchema);
