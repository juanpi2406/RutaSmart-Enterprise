package com.rutasmart.service.interfaces;

import com.rutasmart.dto.NotificacionDTO;

import java.util.List;

public interface NotificacionService {

    List<NotificacionDTO> listar();

    NotificacionDTO buscarPorId(Long id);

    NotificacionDTO guardar(NotificacionDTO dto);

    NotificacionDTO actualizar(Long id, NotificacionDTO dto);

    void eliminar(Long id);

}