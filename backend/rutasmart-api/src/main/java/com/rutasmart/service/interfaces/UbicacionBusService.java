package com.rutasmart.service.interfaces;

import com.rutasmart.dto.UbicacionBusDTO;

import java.util.List;

public interface UbicacionBusService {

    List<UbicacionBusDTO> listar();

    UbicacionBusDTO buscarPorId(Long id);

    UbicacionBusDTO guardar(UbicacionBusDTO dto);

    UbicacionBusDTO actualizar(Long id, UbicacionBusDTO dto);

    void eliminar(Long id);

    List<UbicacionBusDTO> listarActivas();

    UbicacionBusDTO ultimaPorViaje(Long idViaje);

}