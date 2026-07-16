/**
 * Dirección única del backend.
 *
 * En `ng serve` se usa el servidor local. En cualquier sitio publicado
 * (Vercel incluido) se usa la API desplegada en Railway.
 */
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:8080'
  : 'https://rutasmart-enterprise-production.up.railway.app';
