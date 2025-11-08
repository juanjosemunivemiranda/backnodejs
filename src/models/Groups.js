// src/models/Group.js
const mongoose = require("mongoose");
const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Nombre del grupo (ej: "Grupo A - Obstetricia")
    description: { type: String, required: false },

    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationalInstitution",
      required: true,
    }, // A qué institución pertenece el grupo

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin o profesor que creó el grupo
      required: true,
    },

    professors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Profesores asignados al grupo

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Estudiantes del grupo

    rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    ], // Salas asociadas (se manejan en colección aparte)

    isActive: { type: Boolean, default: true }, // Estado del grupo
    configuration: {
      LB: [{ type: Number, default: 0 }], // - FHR baseline (beats per minute)
      AC: [{ type: Number, default: 0 }], // # of accelerations per second
      FM: [{ type: Number, default: 0 }], // # of fetal movements per second
      UC: [{ type: Number, default: 0 }], // - # of uterine contractions per second
      DL: [{ type: Number, default: 0 }], // - # of light decelerations per second
      DS: [{ type: Number, default: 0 }], // - # of severe decelerations per second
      DP: [{ type: Number, default: 0 }], // - # of prolongued decelerations per second
      ASTV: [{ type: Number, default: 0 }], // - percentage of time with abnormal short term variability
      MSTV: [{ type: Number, default: 0 }], // - mean value of short term variability
      ALTV: [{ type: Number, default: 0 }], // - percentage of time with abnormal long term variability
      MLTV: [{ type: Number, default: 0 }], // - mean value of long term variability
      Width: [{ type: Number, default: 0 }], // - width of FHR histogram
      Min: [{ type: Number, default: 0 }], // - minimum of FHR histogram
      Max: [{ type: Number, default: 0 }], // - Maximum of FHR histogram
      Nmax: [{ type: Number, default: 0 }], // - # of histogram peaks
      Nzeros: [{ type: Number, default: 0 }], // - # of histogram zeros
      Mode: [{ type: Number, default: 0 }], // - histogram mode
      Mean: [{ type: Number, default: 0 }], // - histogram mean
      Median: [{ type: Number, default: 0 }], // - histogram median
      Variance: [{ type: Number, default: 0 }], // - histogram variance
      Tendency: [{ type: Number, default: 0 }], // - histogram tendency
    },
  },
  { timestamps: true, collection: "groups" }
);

module.exports = mongoose.model("Group", GroupSchema);
