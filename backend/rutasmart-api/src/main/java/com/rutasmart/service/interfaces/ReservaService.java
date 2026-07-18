package com.rutasmart.service.interfaces;

import com.rutasmart.dto.CapacidadViajeDTO;
import com.rutasmart.dto.ReservaDTO;
import com.rutasmart.dto.ValidacionQrDTO;

import java.util.List;

public interface ReservaService {

    List<ReservaDTO> listar();

    List<ReservaDTO> listarPorAlumno(Long idAlumno);

    List<ReservaDTO> listarPorViaje(Long idViaje);

    ReservaDTO buscarPorId(Long id);

    ReservaDTO guardar(ReservaDTO dto);

    ReservaDTO actualizar(Long id, ReservaDTO dto);

    void eliminar(Long id);

    ValidacionQrDTO validarQr(String codigoQr, Long idViaje);

    CapacidadViajeDTO obtenerCapacidad(Long idViaje);

}