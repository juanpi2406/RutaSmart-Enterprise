package com.rutasmart.service.impl;

import com.rutasmart.dto.ReservaDTO;
import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Asiento;
import com.rutasmart.entity.Paradero;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ReservaMapper;
import com.rutasmart.repository.AlumnoRepository;
import com.rutasmart.repository.AsientoRepository;
import com.rutasmart.repository.ParaderoRepository;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.interfaces.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final AlumnoRepository alumnoRepository;
    private final ViajeRepository viajeRepository;
    private final ParaderoRepository paraderoRepository;
    private final AsientoRepository asientoRepository;
    private final ReservaMapper reservaMapper;

    @Override
    public List<ReservaDTO> listar() {
        return reservaMapper.toDTOList(reservaRepository.findAll());
    }

    @Override
    public List<ReservaDTO> listarPorAlumno(Long idAlumno) {
        return reservaMapper.toDTOList(reservaRepository.findByAlumno_IdAlumno(idAlumno));
    }

    @Override
    public List<ReservaDTO> listarPorViaje(Long idViaje) {
        return reservaMapper.toDTOList(reservaRepository.findByViaje_IdViaje(idViaje));
    }

    @Override
    public ReservaDTO buscarPorId(Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva no encontrada."));

        return reservaMapper.toDTO(reserva);
    }

    @Override
    public ReservaDTO guardar(ReservaDTO dto) {

        Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alumno no encontrado."));

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

        Paradero paradero = paraderoRepository.findById(dto.getIdParadero())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paradero no encontrado."));

        if (reservaRepository.existsByAlumnoAndViaje(alumno, viaje)) {
            throw new BusinessException(
                    "El alumno ya tiene una reserva para este viaje."
            );
        }

        Reserva reserva = reservaMapper.toEntity(dto);

        reserva.setAlumno(alumno);
        reserva.setViaje(viaje);
        reserva.setParadero(paradero);

        Reserva guardada = reservaRepository.save(reserva);

        if (guardada.getNumeroAsiento() != null) {
            asientoRepository.findByViaje_IdViajeAndNumeroAsiento(guardada.getViaje().getIdViaje(), guardada.getNumeroAsiento())
                    .ifPresent(asiento -> {
                        asiento.setEstado(false);
                        asientoRepository.save(asiento);
                    });
        }

        return reservaMapper.toDTO(guardada);

    }

    @Override
    public ReservaDTO actualizar(Long id, ReservaDTO dto) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva no encontrada."));

        Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alumno no encontrado."));

        Viaje viaje = viajeRepository.findById(dto.getIdViaje())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Viaje no encontrado."));

        Paradero paradero = paraderoRepository.findById(dto.getIdParadero())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Paradero no encontrado."));

        reserva.setAlumno(alumno);
        reserva.setViaje(viaje);
        reserva.setParadero(paradero);
        reserva.setFechaAbordaje(dto.getFechaAbordaje());
        reserva.setCodigoQr(dto.getCodigoQr());
        reserva.setEstado(dto.getEstado());
        reserva.setNumeroAsiento(dto.getNumeroAsiento());

        Reserva actualizada = reservaRepository.save(reserva);

        liberarAsiento(actualizada.getIdReserva());

        if (actualizada.getNumeroAsiento() != null && actualizada.getViaje() != null) {
            asientoRepository.findByViaje_IdViajeAndNumeroAsiento(actualizada.getViaje().getIdViaje(), actualizada.getNumeroAsiento())
                    .ifPresent(asiento -> {
                        asiento.setEstado(false);
                        asientoRepository.save(asiento);
                    });
        }

        return reservaMapper.toDTO(actualizada);

    }

    @Override
    public void eliminar(Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva no encontrada."));

        liberarAsiento(id);

        reservaRepository.delete(reserva);

    }

    private void liberarAsiento(Long idReserva) {
        reservaRepository.findById(idReserva).ifPresent(reserva -> {
            if (reserva.getNumeroAsiento() != null && reserva.getViaje() != null) {
                asientoRepository.findByViaje_IdViajeAndNumeroAsiento(reserva.getViaje().getIdViaje(), reserva.getNumeroAsiento())
                        .ifPresent(asiento -> {
                            asiento.setEstado(true);
                            asientoRepository.save(asiento);
                        });
            }
        });
    }

}