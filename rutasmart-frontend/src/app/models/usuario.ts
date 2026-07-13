export interface Usuario {

    /*=========================================
     * USUARIO
     =========================================*/

    idUsuario: number;

    codigo: string;

    nombres: string;

    apellidos: string;

    correo: string;

    telefono: string;

    password?: string;

    estado: boolean;

    idRol: number;

    nombreRol?: string;

    createdAt?: string;

    updatedAt?: string;

    ultimoLogin?: string;

    /*=========================================
     * ALUMNO
     =========================================*/

    codigoUniversitario?: string;

    facultad?: string;

    sede?: string;

    ciclo?: number;

    /*=========================================
     * CHOFER
     =========================================*/

    numeroLicencia?: string;

    categoriaLicencia?: string;

    fechaVencimiento?: string;

}

export type { ApiResponse } from './api-response';
