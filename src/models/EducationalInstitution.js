// src/models/EducationalInstitution.js
const mongoose = require("mongoose");

const EducationalInstitutionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Nombre oficial de la institución
    shortName: { type: String, required: false }, // Sigla o abreviatura (ej: MIT, UNAL)
    type: {
      type: String,
      enum: ["UNIVERSITY", "INSTITUTE", "COLLEGE", "SCHOOL", "ACADEMY"],
      required: true,
    }, // Clasificación
    country: { type: String, required: true }, // País
    city: { type: String, required: true }, // Ciudad
    address: { type: String, required: false }, // Dirección física
    website: { type: String, required: false }, // Página web
    phone: { type: String, required: false }, // Teléfono de contacto
    email: { type: String, required: false, unique: true }, // Correo de contacto institucional
    accreditation: { type: String, required: false }, // Ej: "Ministerio de Educación"
    foundedYear: { type: Number, required: false }, // Año de fundación
    isActive: { type: Boolean, default: true }, // Estado de la institución
    extraInfo: { type: mongoose.Schema.Types.Mixed, required: false }, // Campo flexible
  },
  { timestamps: true, collection: "educational_institutions" }
);

module.exports = mongoose.model(
  "EducationalInstitution",
  EducationalInstitutionSchema
);
