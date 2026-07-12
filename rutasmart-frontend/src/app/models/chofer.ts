/*
==========================================================
MODELO CHOFER
Basado en ChoferResponseDTO / ChoferCreateDTO / ChoferUpdateDTO
==========================================================
*/

export interface ChoferResponse {
    idChofer: number;
    idUsuario: number;
    codigo: string;
    nombres: string;
    apellidos: string;
    correo: string;
    telefono: string;
    numeroLicencia: string;
    categoriaLicencia: string;
    fechaVencimiento: string;
    estado: boolean;
}

export interface ChoferCreate {
    idUsuario: number;
    numeroLicencia: string;
    categoriaLicencia: string;
    fechaVencimiento: string;
    estado?: boolean;
}

export interface ChoferUpdate {
    numeroLicencia: string;
    categoriaLicencia: string;
    fechaVencimiento: string;
    estado: boolean;
}
