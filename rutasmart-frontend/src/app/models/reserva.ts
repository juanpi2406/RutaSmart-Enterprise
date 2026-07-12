import { Alumno } from './alumno';
import { Viaje } from './viaje';
import { Paradero } from './paradero';

export interface Reserva {
    idReserva: number;
    idAlumno: number;
    idViaje: number;
    idParadero: number;
    fechaReserva?: string;
    fechaAbordaje?: string;
    codigoQr?: string;
    estado: string;
    numeroAsiento?: number;
    alumno?: Alumno;
    viaje?: Viaje;
    paradero?: Paradero;
}
