package com.rutasmart.service.impl;

import com.rutasmart.dto.IncidenciaDTO;
import com.rutasmart.entity.Incidencia;
import com.rutasmart.entity.Usuario;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.IncidenciaMapper;
import com.rutasmart.repository.IncidenciaRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.IncidenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidenciaServiceImpl implements IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ViajeRepository viajeRepository;
    private final IncidenciaMapper incidenciaMapper;

    @Override
    public List<IncidenciaDTO> listar() {
        return incidenciaMapper.toDTOList(incidenciaRepository.findAll());
    }

    @Override
    public IncidenciaDTO buscarPorId(Long id) {

        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incidencia no encontrada."));

        return incidenciaMapper.toDTO(incidencia);

    }

    @Override
    public IncidenciaDTO guardar(IncidenciaDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado."));

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

        Incidencia incidencia = incidenciaMapper.toEntity(dto);

        incidencia.setUsuario(usuario);
        incidencia.setViaje(viaje);

        return incidenciaMapper.toDTO(
                incidenciaRepository.save(incidencia)
        );

    }

    @Override
    public IncidenciaDTO actualizar(Long id, IncidenciaDTO dto) {

        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incidencia no encontrada."));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado."));

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

        incidencia.setUsuario(usuario);
        incidencia.setViaje(viaje);
        incidencia.setTipo(dto.getTipo());
        incidencia.setDescripcion(dto.getDescripcion());
        incidencia.setEstado(dto.getEstado());

        return incidenciaMapper.toDTO(
                incidenciaRepository.save(incidencia)
        );

    }

    @Override
    public void eliminar(Long id) {

        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incidencia no encontrada."));

        incidenciaRepository.delete(incidencia);

    }

}