export interface DashboardAlumno {

  /**
   * Hora del próximo viaje.
   * Ejemplo: 17:00
   */
  proximoViaje: string;

  /**
   * Estado del bus.
   * Ejemplo:
   * EN_RUTA
   * PROGRAMADO
   * FINALIZADO
   */
  estadoBus: string;

  /**
   * Cantidad de reservas del alumno.
   */
  misReservas: number;

  /**
   * Notificaciones pendientes.
   */
  notificaciones: number;

  /**
   * Ruta asignada.
   */
  ruta: string;

  /**
   * Paradero asignado.
   */
  paradero: string;

  /**
   * Hora estimada de llegada del bus.
   */
  horaLlegadaBus: string;

  idRuta?: number;
  codigoRuta?: string;
  idViaje?: number;

}
