package com.rutasmart.service.interfaces;

import com.rutasmart.dto.ViajeDTO;

import java.util.List;

public interface ViajeService {

    List<ViajeDTO> listar();

    List<ViajeDTO> listarPorChofer(Long idChofer);

    List<ViajeDTO> listarPorRutaYFecha(Long idRuta, String fechaViaje);

    ViajeDTO buscarPorId(Long id);

    ViajeDTO actualizarEstado(Long id, String estado);

    ViajeDTO guardar(ViajeDTO dto);

    ViajeDTO actualizar(Long id, ViajeDTO dto);

    void eliminar(Long id);

    List<ViajeDTO> listarHistorial();

}