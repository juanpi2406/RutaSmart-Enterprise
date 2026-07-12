package com.rutasmart.service.interfaces;

import com.rutasmart.dto.ParaderoDTO;

import java.util.List;

public interface ParaderoService {

    List<ParaderoDTO> listar();

    ParaderoDTO buscarPorId(Long id);

    ParaderoDTO guardar(ParaderoDTO dto);

    ParaderoDTO actualizar(Long id, ParaderoDTO dto);

    void eliminar(Long id);

    List<ParaderoDTO> listarPorRuta(Long idRuta);

}