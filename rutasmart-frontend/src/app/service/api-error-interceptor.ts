import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const RECURSOS: Record<string, string> = {
  usuarios: 'los usuarios', alumnos: 'los alumnos', choferes: 'los choferes',
  buses: 'los buses', rutas: 'las rutas', paraderos: 'los paraderos',
  programaciones: 'las programaciones', viajes: 'los viajes', reservas: 'las reservas',
  incidencias: 'las incidencias', notificaciones: 'las notificaciones', perfiles: 'el perfil',
  roles: 'los roles', asignaciones: 'las asignaciones'
};

function recursoDe(url: string): string {
  const recurso = Object.keys(RECURSOS).find((nombre) => new RegExp(`/${nombre}(?:/|$)`).test(url));
  return recurso ? RECURSOS[recurso] : 'la información solicitada';
}

function operacionDe(method: string, recurso: string): string {
  const acciones: Record<string, string> = {
    GET: 'No se pudo cargar', POST: 'No se pudo registrar', PUT: 'No se pudo actualizar',
    PATCH: 'No se pudo actualizar', DELETE: 'No se pudo eliminar'
  };
  return `${acciones[method] ?? 'No se pudo procesar'} ${recurso}`;
}

function detalleDe(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0: return 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.';
    case 400:
    case 422: return 'Verifica los datos ingresados e inténtalo nuevamente.';
    case 401: return 'Tu sesión no es válida o ha vencido. Inicia sesión nuevamente.';
    case 403: return 'No tienes permiso para realizar esta operación.';
    case 404: return 'El registro solicitado ya no existe o no fue encontrado.';
    case 409: return 'Ya existe un registro con esos datos.';
    default: return 'Ocurrió un problema en el servidor. Inténtalo nuevamente en unos momentos.';
  }
}

function mensajeDelServidor(error: HttpErrorResponse): string | null {
  const mensaje = error.error?.message ?? error.error?.mensaje;
  if (typeof mensaje !== 'string' || !mensaje.trim()) return null;

  // Los mensajes de validación del backend sí son útiles para la persona usuaria.
  return error.status === 400 || error.status === 422 ? mensaje : null;
}

/** Proporciona mensajes comprensibles y relacionados con la transacción fallida. */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);

      const recurso = recursoDe(req.url);
      const mensaje = `${operacionDe(req.method, recurso)}. ${mensajeDelServidor(error) ?? detalleDe(error)}`;
      const errorNormalizado = new HttpErrorResponse({
        error: { ...(typeof error.error === 'object' && error.error ? error.error : {}), message: mensaje },
        headers: error.headers,
        status: error.status,
        statusText: error.statusText,
        url: error.url ?? undefined
      });

      return throwError(() => errorNormalizado);
    })
  );
