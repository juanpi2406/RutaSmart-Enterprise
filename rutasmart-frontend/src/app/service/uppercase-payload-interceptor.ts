import { HttpInterceptorFn } from '@angular/common/http';

const CAMPOS_EXCLUIDOS = new Set([
  'correo', 'email', 'password', 'contrasena', 'contraseña', 'token',
  'fecha', 'fechaviaje', 'fechaabordaje', 'fechainicio', 'fechafin',
  'fechavencimiento', 'horasalida', 'horallegadaestimada'
]);

function debeConservar(valor: string, campo: string): boolean {
  const nombre = campo.toLowerCase();
  return CAMPOS_EXCLUIDOS.has(nombre) || nombre.includes('fecha') || nombre.includes('hora')
    || nombre.includes('password') || nombre.includes('correo') || valor.includes('@');
}

function convertir(valor: unknown, campo = ''): unknown {
  if (typeof valor === 'string') return debeConservar(valor, campo) ? valor : valor.toUpperCase();
  if (Array.isArray(valor)) return valor.map((item) => convertir(item, campo));
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([clave, dato]) => [clave, convertir(dato, clave)]));
  }
  return valor;
}

/** Normaliza textos antes de enviarlos al API, sin modificar correos, claves ni fechas. */
export const uppercasePayloadInterceptor: HttpInterceptorFn = (req, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method) || !req.body || typeof req.body !== 'object') {
    return next(req);
  }

  return next(req.clone({ body: convertir(req.body) }));
};
