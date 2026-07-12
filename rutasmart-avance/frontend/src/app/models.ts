export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
  rol: string;        // ADMINISTRADOR | ALUMNO | CHOFER
  estado: string;     // ACTIVO | VACACIONES | INACTIVO
  dni?: string;
  licencia?: string;
  vencimiento?: string;
  telefono?: string;
}

export interface Bus {
  id?: number;
  codigo: string;
  placa?: string;
  ruta?: string;
  chofer?: string;
  estado?: string;    // DISPONIBLE | EN_RUTA | MANTENIMIENTO
}

export interface Reserva {
  id?: number;
  alumno: string;
  ruta: string;       // Norte | Sur | Centro
  fecha: string;      // YYYY-MM-DD
  hora: string;       // HH:mm
  estado: string;     // CONFIRMADA | PENDIENTE | CANCELADA
}

export interface Incidencia {
  id?: number;
  tipo?: string;
  descripcion: string;
  fecha: string;
  estado?: string;    // Activa | En revision | Resuelta
  reportadoPor?: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  role: string;
}

export interface DashboardKpis {
  alumnos: number;
  buses: number;
  reservas: number;
  incidencias: number;
  reservasPorRuta: { [ruta: string]: number };
  flota: { operativos: number; enRuta: number; mantenimiento: number };
}

export interface ReporteResumen {
  totalUsuarios: number;
  totalReservas: number;
  totalBuses: number;
  totalIncidencias: number;
  reservasConfirmadas: number;
  reservasPendientes: number;
  reservasCanceladas: number;
  reservasPorRuta: { [ruta: string]: number };
  flota: { operativos: number; enRuta: number; mantenimiento: number };
}
