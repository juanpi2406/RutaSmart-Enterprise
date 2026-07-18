package com.rutasmart.service.interfaces;

import com.rutasmart.dto.NotificacionDTO;

import java.util.List;

public interface NotificacionService {

    List<NotificacionDTO> listar();

    NotificacionDTO buscarPorId(Long id);

    NotificacionDTO guardar(NotificacionDTO dto);

    NotificacionDTO actualizar(Long id, NotificacionDTO dto);

    void eliminar(Long id);

    List<NotificacionDTO> listarPorUsuario(Long idUsuario);

    long contarNoLeidas(Long idUsuario);

    long contarNoLeidasGlobales();

    NotificacionDTO marcarLeida(Long id);

    List<NotificacionDTO> listarRecientes();

    NotificacionDTO enviar(Long idUsuario, String titulo, String mensaje, String tipo);

}