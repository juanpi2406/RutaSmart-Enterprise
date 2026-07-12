package com.rutasmart.service.impl;

import com.rutasmart.dto.NotificacionDTO;
import com.rutasmart.entity.Notificacion;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.NotificacionMapper;
import com.rutasmart.repository.NotificacionRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.service.interfaces.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacionMapper notificacionMapper;

    @Override
    public List<NotificacionDTO> listar() {
        return notificacionMapper.toDTOList(
                notificacionRepository.findAll()
        );
    }

    @Override
    public NotificacionDTO buscarPorId(Long id) {

        Notificacion notificacion =
                notificacionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notificación no encontrada."
                                ));

        return notificacionMapper.toDTO(notificacion);

    }

    @Override
    public NotificacionDTO guardar(NotificacionDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        Notificacion notificacion =
                notificacionMapper.toEntity(dto);

        notificacion.setUsuario(usuario);

        return notificacionMapper.toDTO(
                notificacionRepository.save(notificacion)
        );

    }

    @Override
    public NotificacionDTO actualizar(Long id,
                                      NotificacionDTO dto) {

        Notificacion notificacion =
                notificacionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notificación no encontrada."
                                ));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado."
                        ));

        notificacion.setUsuario(usuario);
        notificacion.setTitulo(dto.getTitulo());
        notificacion.setMensaje(dto.getMensaje());
        notificacion.setTipo(dto.getTipo());
        notificacion.setLeido(dto.getLeido());

        return notificacionMapper.toDTO(
                notificacionRepository.save(notificacion)
        );

    }

    @Override
    public void eliminar(Long id) {

        Notificacion notificacion =
                notificacionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notificación no encontrada."
                                ));

        notificacionRepository.delete(notificacion);

    }

}