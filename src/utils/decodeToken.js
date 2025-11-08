import jwt from "jsonwebtoken";

/**
 * Decodifica un token JWT sin validar la firma.
 * @param {string} token - Token JWT a decodificar.
 * @returns {object|null} - El payload decodificado o null si el token no es válido.
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;

    // jwt.decode NO verifica la firma, solo decodifica el contenido
    const decoded = jwt.decode(token, { complete: true });
    return decoded?.payload || null;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
