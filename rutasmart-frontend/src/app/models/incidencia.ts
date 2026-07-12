export interface Incidencia {
    idIncidencia: number;
    idUsuario: number;
    idViaje?: number;
    tipo: string;
    descripcion: string;
    estado: string;
    fechaRegistro?: string;
}
