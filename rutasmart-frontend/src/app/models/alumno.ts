/*
==========================================================
MODELO ALUMNO
Basado en AlumnoDTO (plano, backend no anida datos de usuario)
==========================================================
*/

export interface Alumno {
    idAlumno: number;
    idUsuario: number;
    codigoUniversitario: string;
    facultad: string;
    sede: string;
    ciclo: number;
    estado: boolean;
}
