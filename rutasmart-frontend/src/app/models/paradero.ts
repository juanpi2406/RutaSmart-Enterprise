export interface Paradero {
    idParadero: number;
    idRuta: number;
    nombre: string;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    orden: number;
    tiempoEstimadoMin?: number;
    estado: boolean;
}
