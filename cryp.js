import { randomBytes } from 'crypto';

// Genera una cadena de 64 bytes (128 caracteres hexadecimales)
const jwtSecret = randomBytes(64).toString('hex');
console.log(jwtSecret);