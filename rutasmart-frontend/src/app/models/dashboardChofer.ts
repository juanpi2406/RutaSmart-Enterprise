export interface DashboardChofer {

  /**
   * Código del bus asignado.
   * Ejemplo: BUS-01
   */
  busAsignado: string;

  /**
   * Ruta asignada al chofer.
   */
  ruta: string;

  /**
   * Estado del viaje.
   * Ejemplo:
   * PROGRAMADO
   * EN_RUTA
   * FINALIZADO
   */
  estadoViaje: string;

  /**
   * Hora de salida programada.
   */
  horaSalida: string;

  /**
   * Hora estimada de llegada.
   */
  horaLlegada: string;

  /**
   * Cantidad de pasajeros registrados.
   */
  pasajeros: number;

  /**
   * Asientos disponibles.
   */
  asientosDisponibles: number;

  /**
   * Incidencias del día.
   */
  incidenciasHoy: number;

  /**
   * ID del viaje activo o más reciente.
   */
  idViaje?: number;

  idRuta?: number;
  codigoRuta?: string;
  viajesPendientesHoy?: number;
  viajesCompletadosHoy?: number;
  mensajeJornada?: string;

}
