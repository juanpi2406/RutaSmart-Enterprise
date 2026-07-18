export interface ReservaPorDia {
  fecha: string;
  total: number;
}

export interface ActividadReciente {
  hora: string;
  evento: string;
  estado: string;
}

export interface DashboardAdmin {
  totalUsuarios: number;
  totalAlumnos: number;
  totalChoferes: number;
  totalBuses: number;
  totalReservas: number;
  viajesActivos: number;
  incidenciasPendientes: number;
  busesOperativos?: number;
  busesMantenimiento?: number;
  reservasPorDia?: ReservaPorDia[];
  actividadReciente?: ActividadReciente[];
}
