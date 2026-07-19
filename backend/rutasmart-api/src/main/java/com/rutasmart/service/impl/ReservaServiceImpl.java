package com.rutasmart.service.impl;

import com.rutasmart.dto.ReservaDTO;
import com.rutasmart.dto.ValidacionQrDTO;
import com.rutasmart.dto.CapacidadViajeDTO;
import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Paradero;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.exception.ResourceNotFoundException;
import com.rutasmart.mapper.ReservaMapper;
import com.rutasmart.repository.AlumnoRepository;
import com.rutasmart.repository.ParaderoRepository;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.repository.ViajeRepository;
import com.rutasmart.service.AsistenciaReservaService;
import com.rutasmart.service.interfaces.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final AlumnoRepository alumnoRepository;
    private final ViajeRepository viajeRepository;
    private final ParaderoRepository paraderoRepository;
    private final ReservaMapper reservaMapper;
    private final AsistenciaReservaService asistenciaReservaService;

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
    @Transactional
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

        asistenciaReservaService.validarPuedeReservar(alumno);

        Reserva reserva = reservaMapper.toEntity(dto);

        reserva.setAlumno(alumno);
        reserva.setViaje(viaje);
        reserva.setParadero(paradero);

        if (reserva.getEstado() == null || reserva.getEstado().isBlank()) {
            reserva.setEstado("RESERVADO");
        }
        if (reserva.getCodigoQr() == null || reserva.getCodigoQr().isBlank()) {
            reserva.setCodigoQr("RS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        LocalDateTime horaProgramada = asistenciaReservaService.horaAbordajeProgramada(viaje);
        if (horaProgramada != null) {
            reserva.setFechaAbordaje(horaProgramada);
        }

        Long reservasActuales = reservaRepository.countByViaje_IdViaje(
                viaje.getIdViaje()
        );

        Short capacidad = (viaje.getBus() != null)
                ? viaje.getBus().getCapacidadAsientos()
                : null;

        if (capacidad != null && reservasActuales >= capacidad) {
            throw new BusinessException(
                    "No existen cupos disponibles para este viaje."
            );
        }

        Reserva guardada = reservaRepository.save(reserva);

        return reservaMapper.toDTO(guardada);

    }

    @Override
    @Transactional
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

        return reservaMapper.toDTO(actualizada);

    }

    @Override
    public void eliminar(Long id) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Reserva no encontrada."));

        reservaRepository.delete(reserva);

    }

    @Override
    @Transactional
    public ValidacionQrDTO validarQr(String codigoQr, Long idViaje) {
        Reserva reserva = reservaRepository.findByCodigoQrAndViaje_IdViaje(codigoQr, idViaje)
                .orElse(null);

        if (reserva == null) {
            return ValidacionQrDTO.builder()
                    .valido(false)
                    .mensaje("Código QR no válido para este viaje.")
                    .build();
        }

        if ("CANCELADO".equalsIgnoreCase(reserva.getEstado())
                || "CANCELADA".equalsIgnoreCase(reserva.getEstado())) {
            return ValidacionQrDTO.builder()
                    .valido(false)
                    .mensaje("La reserva está cancelada.")
                    .build();
        }

        if ("ABORDADO".equalsIgnoreCase(reserva.getEstado())) {
            return ValidacionQrDTO.builder()
                    .valido(false)
                    .mensaje("El alumno ya abordó.")
                    .reserva(reservaMapper.toDTO(reserva))
                    .build();
        }

        reserva.setFechaAbordaje(LocalDateTime.now());
        reserva.setEstado("ABORDADO");
        Reserva actualizada = reservaRepository.save(reserva);

        return ValidacionQrDTO.builder()
                .valido(true)
                .mensaje("Embarque confirmado.")
                .reserva(reservaMapper.toDTO(actualizada))
                .build();
    }

    @Override
    public CapacidadViajeDTO obtenerCapacidad(Long idViaje) {
        Viaje viaje = viajeRepository.findById(idViaje)
                .orElseThrow(() -> new ResourceNotFoundException("Viaje no encontrado."));

        Long ocupados = reservaRepository.countByViaje_IdViaje(idViaje);
        Short capacidad = viaje.getBus() != null ? viaje.getBus().getCapacidadAsientos() : 0;
        long disp = Math.max(0, (capacidad != null ? capacidad : 0) - ocupados);

        return CapacidadViajeDTO.builder()
                .idViaje(idViaje)
                .capacidad(capacidad)
                .ocupados(ocupados)
                .disponibles(disp)
                .build();
    }


}