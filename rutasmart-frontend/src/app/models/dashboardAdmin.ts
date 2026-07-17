export interface DashboardAdmin {

  /**
   * Total de usuarios registrados.
   */
  totalUsuarios: number;

  /**
   * Total de alumnos registrados.
   */
  totalAlumnos: number;

  /**
   * Total de choferes registrados.
   */
  totalChoferes: number;

  /**
   * Total de buses registrados.
   */
  totalBuses: number;

  /**
   * Total de reservas registradas.
   */
  totalReservas: number;

  /**
   * Viajes actualmente en ruta.
   */
  viajesActivos: number;

  /**
   * Incidencias pendientes.
   */
  incidenciasPendientes: number;

}
