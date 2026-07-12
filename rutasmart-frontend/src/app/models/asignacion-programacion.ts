export interface AsignacionProgramacion {
    idAsignacion: number;
    idProgramacion: number;
    idBus: number;
    idChofer: number;
    fechaInicio: string;
    fechaFin?: string;
    estado: boolean;
}
