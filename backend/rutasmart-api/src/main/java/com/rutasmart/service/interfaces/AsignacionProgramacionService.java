package com.rutasmart.service.interfaces;

import com.rutasmart.dto.AsignacionProgramacionDTO;

import java.util.List;

public interface AsignacionProgramacionService {

    List<AsignacionProgramacionDTO> listar();

    List<AsignacionProgramacionDTO> listarPorChofer(Long idChofer);

    AsignacionProgramacionDTO buscarPorId(Long id);

    AsignacionProgramacionDTO guardar(AsignacionProgramacionDTO dto);

    AsignacionProgramacionDTO actualizar(Long id, AsignacionProgramacionDTO dto);

    void eliminar(Long id);

}