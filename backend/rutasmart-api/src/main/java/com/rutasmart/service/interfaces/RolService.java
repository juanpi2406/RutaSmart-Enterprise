package com.rutasmart.service.interfaces;

import com.rutasmart.dto.RolDTO;

import java.util.List;

public interface RolService {

    List<RolDTO> listar();

    RolDTO buscarPorId(Long id);

    RolDTO guardar(RolDTO dto);

    RolDTO actualizar(Long id, RolDTO dto);

    void eliminar(Long id);

}