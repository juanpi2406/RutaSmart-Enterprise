export interface Ruta {
    idRuta: number;
    codigo: string;
    nombre: string;
    origen: string;
    destino: string;
    descripcion?: string;
    distanciaKm?: number;
    tiempoEstimadoMin?: number;
    estado: boolean;
}
