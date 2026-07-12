package com.rutasmart.service.interfaces;

import com.rutasmart.dto.UsuarioCreateDTO;
import com.rutasmart.dto.UsuarioResponseDTO;
import com.rutasmart.dto.UsuarioUpdateDTO;

import java.util.List;

public interface UsuarioService {

    /**
     * Lista todos los usuarios.
     */
    List<UsuarioResponseDTO> listar();

    /**
     * Busca un usuario por su ID.
     */
    UsuarioResponseDTO buscarPorId(Long id);

    /**
     * Registra un nuevo usuario.
     */
    UsuarioResponseDTO guardar(UsuarioCreateDTO dto);

    /**
     * Actualiza un usuario existente.
     */
    UsuarioResponseDTO actualizar(Long id, UsuarioUpdateDTO dto);

    /**
     * Elimina un usuario por su ID.
     */
    void eliminar(Long id);

}
