// src/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    secondName: { type: String },
    lastName: { type: String, required: true },
    secondLastName: { type: String },
    // ROLE
    ROLE: {
      type: String,
      required: true,
      enum: ["STUDENT", "TEACHER", "ADMIN", "OBSERVER"],
    },
    // CLAIMS
    CLAIMS: {
      type: [String], // array de strings
      default: ["VIEW_CLASS", "UPDATE_USER"], // valores iniciales
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EducationalInstitution",
    }, // A qué institución pertenece el usuario
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
