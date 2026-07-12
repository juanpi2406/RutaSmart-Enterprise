package com.rutasmart.service.interfaces;

import com.rutasmart.dto.AlumnoDTO;

import java.util.List;

public interface AlumnoService {

    /**
     * Lista todos los alumnos.
     */
    List<AlumnoDTO> listar();

    /**
     * Busca un alumno por su ID.
     */
    AlumnoDTO buscarPorId(Long id);

    /**
     * Busca un alumno por ID de usuario.
     */
    AlumnoDTO buscarPorUsuarioId(Long idUsuario);

    /**
     * Registra un nuevo alumno.
     */
    AlumnoDTO guardar(AlumnoDTO dto);

    /**
     * Actualiza un alumno.
     */
    AlumnoDTO actualizar(Long id, AlumnoDTO dto);

    /**
     * Elimina un alumno.
     */
    void eliminar(Long id);

}