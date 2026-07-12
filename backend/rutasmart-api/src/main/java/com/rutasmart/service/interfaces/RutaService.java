package com.rutasmart.service.interfaces;

import com.rutasmart.dto.RutaDTO;

import java.util.List;

public interface RutaService {

    List<RutaDTO> listar();

    RutaDTO buscarPorId(Long id);

    RutaDTO guardar(RutaDTO dto);

    RutaDTO actualizar(Long id, RutaDTO dto);

    void eliminar(Long id);

}