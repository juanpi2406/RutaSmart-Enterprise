export interface Usuario {
    idUsuario: number;
    codigo: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono: string;
    estado: boolean;
    idRol: number;
    nombreRol: string;
    createdAt?: string;
    updatedAt?: string;
    ultimoLogin?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
