// src/controllers/auth.controller.js

const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/response");
const authService = require("../services/auth.service");
const educationalInstitutionService = require("../services/educationalInstitution.service");
const { documentTypes } = require("../utils/utils");
const { defaultClaims } = require("../utils/defaultClaims");

const secret = process.env.JWT_SECRET;

// Controlador para la ruta de login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Llama al servicio para encontrar al usuario
    const user = await authService.findUser(username, password);

    if (!user) {
      return error(res, "Credenciales incorrectas", 400);
    }

    // Si el usuario existe, se crea el JWT
    const token = jwt.sign({ user }, secret, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ user }, secret, { expiresIn: "1d" });

    return success(res, { token, refreshToken }, "Login Correcto");
  } catch (e) {
    return error(error, "Error al iniciar sesion, intentelo nuevamente", 500);
  }
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);
    console.log("🚀 ~ refreshToken ~ decoded:", decoded);

    const token = jwt.sign({ user: decoded.user }, secret, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign({ user: decoded.user }, secret, {
      expiresIn: "30m",
    });
    return success(
      res,
      { token, refreshToken: newRefreshToken },
      "Login correcto",
      200
    );
  } catch (e) {
    return error(res, e.message, 500);
  }
};

const register = async (req, res) => {
  try {
    const {
      _id,
      username,
      firstName,
      secondName,
      lastName,
      secondLastName,
      ROLE,
      institution,
      documentNumber,
      documentType,
    } = req.body;

    let isUpdate = false;

    // Verificar existencia de usuario
    const existing = await authService.findUserByUsername(username);
    if (_id !== "" && _id !== undefined && _id !== null) {
      isUpdate = true;
    }
    console.log("🚀 ~ register ~ isUpdate:", isUpdate);

    if (existing && !isUpdate) {
      return error(res, "Usuario ya existe", 400);
    }

    if (ROLE !== "ADMIN") {
      if (
        institution === undefined ||
        institution === null ||
        institution.length === 0
      ) {
        return error(res, "La institución es requerida", 400);
      }
      const institutionExists =
        await educationalInstitutionService.findEducationalInstitutionById(
          institution
        );
      if (!institutionExists)
        return error(res, "La institucion relacionada no existe", 400);
    }

    if (!documentTypes.includes(documentType)) {
      return error(res, "Typo de Documento no existe", 400);
    }

    if (documentNumber === null || documentNumber === undefined) {
      return error(res, "Numero de documento es requerido", 400);
    }

    if (documentNumber.length < 5) {
      return error(res, "Numero de documento es invalido", 400);
    }

    const CLAIMS = defaultClaims(ROLE);

    let name = firstName;
    if (secondName !== "") name = `${name} ${secondName}`;
    name = `${name} ${lastName}`;
    if (secondLastName !== "") name = `${name} ${secondLastName}`;

    const password = documentNumber;

    const userData = {
      _id,
      name,
      username,
      password,
      firstName,
      secondName,
      lastName,
      secondLastName,
      ROLE,
      CLAIMS,
      institution,
      documentNumber,
      documentType,
    };

    let userStatus = null;
    console.log("🚀 ~ register ~ userData:", userData);
    if (isUpdate) {
      userStatus = await authService.updateUser(userData);
    } else {
      userStatus = await authService.createUser(userData);
    }

    return success(
      res,
      userStatus,
      isUpdate
        ? "Usario actualizado correctamente"
        : "Usuario creado correctamente",
      200
    );
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = {
  login,
  refreshToken,
  register,
};
