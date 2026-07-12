/*
==========================================================
MODELO ALUMNO
Basado en AlumnoResponseDTO
==========================================================
*/

import { Usuario } from './usuario';

export interface Alumno {

    idAlumno: number;

    codigoUniversitario: string;

    facultad: string;

    sede: string;

    ciclo: number;

    estado: boolean;

    usuario: Usuario;

    createdAt?: string;

    updatedAt?: string;

}

/*
==========================================================
DTO CREAR ALUMNO
==========================================================
*/

export interface AlumnoCreate {

    idUsuario: number;

    codigoUniversitario: string;

    facultad: string;

    sede: string;

    ciclo: number;

}

/*
==========================================================
DTO ACTUALIZAR ALUMNO
==========================================================
*/

export interface AlumnoUpdate {

    codigoUniversitario: string;

    facultad: string;

    sede: string;

    ciclo: number;

    estado: boolean;

}

/*
==========================================================
RESPUESTA API
==========================================================
*/

export interface AlumnoResponse {

    success: boolean;

    message: string;

    data: Alumno;

}

export interface AlumnoListResponse {

    success: boolean;

    message: string;

    data: Alumno[];

}
