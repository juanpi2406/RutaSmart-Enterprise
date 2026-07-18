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
    sede?: string;
    /** Calculado en frontend: tiene ≥2 paraderos con GPS */
    mapeable?: boolean;
}
