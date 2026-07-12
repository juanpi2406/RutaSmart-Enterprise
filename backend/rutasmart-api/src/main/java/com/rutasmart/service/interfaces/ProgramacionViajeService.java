package com.rutasmart.service.interfaces;

import com.rutasmart.dto.ProgramacionViajeDTO;

import java.util.List;

public interface ProgramacionViajeService {

    List<ProgramacionViajeDTO> listar();

    ProgramacionViajeDTO buscarPorId(Long id);

    ProgramacionViajeDTO guardar(ProgramacionViajeDTO dto);

    ProgramacionViajeDTO actualizar(Long id, ProgramacionViajeDTO dto);

    void eliminar(Long id);

}