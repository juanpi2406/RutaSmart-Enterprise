package com.rutasmart.service.interfaces;

import com.rutasmart.dto.BusDTO;

import java.util.List;

public interface BusService {

    List<BusDTO> listar();

    BusDTO buscarPorId(Long id);

    BusDTO guardar(BusDTO dto);

    BusDTO actualizar(Long id, BusDTO dto);

    void eliminar(Long id);

}