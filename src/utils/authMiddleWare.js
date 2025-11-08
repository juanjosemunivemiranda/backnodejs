// src/authMiddleWare.js
const jwt = require("jsonwebtoken");
const { success, error } = require("./response");

const authMiddleware = (requiredClaims = null) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return error(res, "Token not provided", 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Si no se piden claims, solo basta que esté autenticado
      if (!requiredClaims) {
        return next();
      }

      // Normalizamos a array (por si pasamos un string)
      const claimsToCheck = Array.isArray(requiredClaims)
        ? requiredClaims
        : [requiredClaims];

      // Validamos intersección entre claims del usuario y los requeridos
      const hasClaim = claimsToCheck.some((claim) =>
        decoded.user.CLAIMS?.includes(claim)
      );

      if (!hasClaim) {
        return error(res, "Forbidden: Missing claim", 403);
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return error(res, "Token expired", 401);
      }
      return error(res, "Invalid token", 402);
    }
  };
};

module.exports = authMiddleware;
