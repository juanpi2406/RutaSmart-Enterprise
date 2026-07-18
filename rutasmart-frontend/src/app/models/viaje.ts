export interface Viaje {
    idViaje: number;
    idProgramacion: number;
    idBus: number;
    idChofer: number;
    fechaViaje: string;
    horaInicioReal?: string;
    horaFinReal?: string;
    estado: string;
    observaciones?: string;
    horaSalida?: string;
    horaLlegadaEstimada?: string;
    idRuta?: number;
    codigoRuta?: string;
    nombreRuta?: string;
}
