package com.rutasmart.service.interfaces;

import com.rutasmart.dto.IncidenciaDTO;

import java.util.List;

public interface IncidenciaService {

    List<IncidenciaDTO> listar();

    IncidenciaDTO buscarPorId(Long id);

    IncidenciaDTO guardar(IncidenciaDTO dto);

    IncidenciaDTO actualizar(Long id, IncidenciaDTO dto);

    void eliminar(Long id);

}