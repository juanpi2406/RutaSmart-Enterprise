package com.rutasmart.service.interfaces;

import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;

import java.util.List;

public interface ChoferService {

    /**
     * Listar todos los choferes.
     */
    List<ChoferResponseDTO> listar();

    /**
     * Buscar chofer por ID.
     */
    ChoferResponseDTO obtenerPorId(Long id);

    /**
     * Registrar un nuevo chofer.
     */
    ChoferResponseDTO crear(ChoferCreateDTO dto);

    /**
     * Actualizar un chofer.
     */
    ChoferResponseDTO actualizar(Long id, ChoferUpdateDTO dto);

    /**
     * Eliminar un chofer.
     */
    void eliminar(Long id);

}