package com.rutasmart.service.interfaces;

import com.rutasmart.dto.UsuarioDTO;

import java.util.List;

public interface UsuarioService {

    /**
     * Lista todos los usuarios.
     */
    List<UsuarioDTO> listar();

    /**
     * Busca un usuario por su ID.
     */
    UsuarioDTO buscarPorId(Long id);

    /**
     * Registra un nuevo usuario.
     */
    UsuarioDTO guardar(UsuarioDTO dto);

    /**
     * Actualiza un usuario existente.
     */
    UsuarioDTO actualizar(Long id, UsuarioDTO dto);

    /**
     * Elimina un usuario.
     */
    void eliminar(Long id);

}