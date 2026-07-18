package com.rutasmart.service.impl;

import com.rutasmart.dto.AlumnoDTO;
import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.AlumnoMapper;
import com.rutasmart.repository.AlumnoRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.service.AsistenciaReservaService;
import com.rutasmart.service.interfaces.AlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlumnoServiceImpl implements AlumnoService {

    private final AlumnoRepository alumnoRepository;

    private final UsuarioRepository usuarioRepository;

    private final AlumnoMapper alumnoMapper;

    private final AsistenciaReservaService asistenciaReservaService;

    private AlumnoDTO enriquecer(Alumno alumno) {
        AlumnoDTO dto = alumnoMapper.toDTO(alumno);
        long inasistencias = asistenciaReservaService.contarInasistencias(alumno.getIdAlumno());
        dto.setInasistencias(inasistencias);
        dto.setPuedeReservar(!asistenciaReservaService.estaSancionado(alumno.getIdAlumno()));
        if (inasistencias >= 3) {
            dto.setBloqueadoReservasHasta(
                    asistenciaReservaService.calcularFinSancion(alumno.getIdAlumno()).toString());
        }
        return dto;
    }

    @Override
    public List<AlumnoDTO> listar() {
        return alumnoRepository.findAll().stream().map(this::enriquecer).toList();
    }

    @Override
    public AlumnoDTO buscarPorId(Long id) {

        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alumno no encontrado."));

        return enriquecer(alumno);
    }

    @Override
    public AlumnoDTO buscarPorUsuarioId(Long idUsuario) {

        Alumno alumno = alumnoRepository.findByUsuario_IdUsuario(idUsuario)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alumno no encontrado para el usuario."));

        return enriquecer(alumno);
    }

    @Override
    public AlumnoDTO guardar(AlumnoDTO dto) {

        if (alumnoRepository.existsByCodigoUniversitario(dto.getCodigoUniversitario())) {

            throw new BusinessException(
                    "El código universitario ya existe."
            );

        }

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado."));

        Alumno alumno = alumnoMapper.toEntity(dto);

        alumno.setUsuario(usuario);

        Alumno guardado = alumnoRepository.save(alumno);

        return enriquecer(guardado);

    }

    @Override
    public AlumnoDTO actualizar(Long id, AlumnoDTO dto) {

        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alumno no encontrado."));

        if (!alumno.getCodigoUniversitario().equals(dto.getCodigoUniversitario())
                && alumnoRepository.existsByCodigoUniversitario(dto.getCodigoUniversitario())) {

            throw new BusinessException(
                    "El código universitario ya existe."
            );

        }

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado."));

        alumno.setUsuario(usuario);
        alumno.setCodigoUniversitario(dto.getCodigoUniversitario());
        alumno.setFacultad(dto.getFacultad());
        alumno.setSede(dto.getSede());
        alumno.setCiclo(dto.getCiclo());
        alumno.setEstado(dto.getEstado());

        Alumno actualizado = alumnoRepository.save(alumno);

        return enriquecer(actualizado);

    }

    @Override
    public void eliminar(Long id) {

        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alumno no encontrado."));

        alumnoRepository.delete(alumno);

    }

}