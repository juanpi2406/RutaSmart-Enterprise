package com.rutasmart.service.interfaces;

<<<<<<< HEAD
import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
=======
import com.rutasmart.dto.ChoferDTO;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

import java.util.List;

public interface ChoferService {

<<<<<<< HEAD
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
=======
    List<ChoferDTO> listar();

    ChoferDTO buscarPorId(Long id);

    ChoferDTO guardar(ChoferDTO dto);

    ChoferDTO actualizar(Long id, ChoferDTO dto);

>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    void eliminar(Long id);

}