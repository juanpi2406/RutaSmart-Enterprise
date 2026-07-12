export interface LoginRequest {
    codigo: string;
    password: string;
}

export interface LoginResponse {
    idUsuario: number;
    codigo: string;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: string;
    estado: boolean;
    token: string;
}
