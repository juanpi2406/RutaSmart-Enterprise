export interface Bus {
    idBus: number;
    codigo: string;
    placa: string;
    marca: string;
    modelo?: string;
    anio?: number;
    color?: string;
    capacidadAsientos: number;
    observaciones?: string;
    estado: boolean;
}
