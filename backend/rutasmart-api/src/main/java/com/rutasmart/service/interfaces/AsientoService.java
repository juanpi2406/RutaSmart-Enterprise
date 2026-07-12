package com.rutasmart.service.interfaces;

import com.rutasmart.dto.AsientoDTO;

import java.util.List;

public interface AsientoService {

    List<AsientoDTO> listarPorViaje(Long idViaje);

    AsientoDTO guardar(AsientoDTO dto);

    AsientoDTO actualizar(Long id, AsientoDTO dto);

    void eliminar(Long id);

}
