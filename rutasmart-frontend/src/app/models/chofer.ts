/*
==========================================================
MODELO CHOFER
Basado en ChoferResponseDTO
==========================================================
*/

import { Usuario } from './usuario';

export interface Chofer {

    idChofer: number;

    licencia: string;

    categoriaLicencia: string;

    fechaVencimiento: string;

    estado: boolean;

    usuario: Usuario;

    createdAt?: string;

    updatedAt?: string;

}

/*
==========================================================
DTO CREAR CHOFER
==========================================================
*/

export interface ChoferCreate {

    idUsuario: number;

    licencia: string;

    categoriaLicencia: string;

    fechaVencimiento: string;

}

/*
==========================================================
DTO ACTUALIZAR CHOFER
==========================================================
*/

export interface ChoferUpdate {

    licencia: string;

    categoriaLicencia: string;

    fechaVencimiento: string;

    estado: boolean;

}

/*
==========================================================
RESPUESTAS API
==========================================================
*/

export interface ChoferResponse {

    success: boolean;

    message: string;

    data: Chofer;

}

export interface ChoferListResponse {

    success: boolean;

    message: string;

    data: Chofer[];

}
