package com.rutasmart.service.impl;

import com.rutasmart.dto.ActividadRecienteDTO;
import com.rutasmart.dto.DashboardAdminDTO;
import com.rutasmart.dto.DashboardAlumnoDTO;
import com.rutasmart.dto.DashboardChoferDTO;
import com.rutasmart.dto.ReservaPorDiaDTO;

import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.Incidencia;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;

import java.time.ZoneId;
import com.rutasmart.repository.AlumnoRepository;
import com.rutasmart.repository.BusRepository;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.IncidenciaRepository;
import com.rutasmart.repository.NotificacionRepository;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.repository.ViajeRepository;

import com.rutasmart.service.interfaces.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UsuarioRepository usuarioRepository;
    private final AlumnoRepository alumnoRepository;
    private final ChoferRepository choferRepository;
    private final BusRepository busRepository;
    private final ReservaRepository reservaRepository;
    private final ViajeRepository viajeRepository;
    private final IncidenciaRepository incidenciaRepository;
    private final NotificacionRepository notificacionRepository;

    @Override
    public DashboardAdminDTO obtenerDashboardAdmin() {

        DashboardAdminDTO dto = new DashboardAdminDTO();

        dto.setTotalUsuarios(usuarioRepository.count());
        dto.setTotalAlumnos(alumnoRepository.count());
        dto.setTotalChoferes(choferRepository.count());
        dto.setTotalBuses(busRepository.count());
        dto.setTotalReservas(reservaRepository.count());

        long enRuta = viajeRepository.countByEstado("EN_RUTA");
        long enCurso = viajeRepository.countByEstado("EN_CURSO");
        dto.setViajesActivos(enRuta + enCurso);

        dto.setIncidenciasPendientes(
                incidenciaRepository.countByEstado("PENDIENTE"));

        long operativos = busRepository.countByEstado(true);
        long mantenimiento = busRepository.countByEstado(false);
        dto.setBusesOperativos(operativos);
        dto.setBusesMantenimiento(mantenimiento);
        dto.setReservasPorDia(construirReservasPorDia(7));
        dto.setActividadReciente(construirActividadReciente());

        return dto;
    }

    private List<ReservaPorDiaDTO> construirReservasPorDia(int dias) {
        LocalDate hoy = LocalDate.now(ZoneId.of("America/Lima"));
        LocalDateTime desde = hoy.minusDays(dias - 1L).atStartOfDay();

        Map<LocalDate, Long> porDia = new HashMap<>();
        for (Reserva reserva : reservaRepository.findByFechaReservaGreaterThanEqualOrderByFechaReservaAsc(desde)) {
            if (reserva.getFechaReserva() == null) {
                continue;
            }
            LocalDate dia = reserva.getFechaReserva().toLocalDate();
            porDia.merge(dia, 1L, Long::sum);
        }

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM");
        List<ReservaPorDiaDTO> resultado = new ArrayList<>();
        for (int i = dias - 1; i >= 0; i--) {
            LocalDate dia = hoy.minusDays(i);
            resultado.add(ReservaPorDiaDTO.builder()
                    .fecha(dia.format(fmt))
                    .total(porDia.getOrDefault(dia, 0L))
                    .build());
        }
        return resultado;
    }

    private List<ActividadRecienteDTO> construirActividadReciente() {
        List<ActividadRecienteDTO> items = new ArrayList<>();
        DateTimeFormatter horaFmt = DateTimeFormatter.ofPattern("HH:mm");

        for (Reserva reserva : reservaRepository.findTop5ByOrderByFechaReservaDesc()) {
            LocalDateTime fecha = reserva.getFechaReserva() != null
                    ? reserva.getFechaReserva()
                    : LocalDateTime.now();
            items.add(ActividadRecienteDTO.builder()
                    .hora(fecha.toLocalTime().format(horaFmt))
                    .evento("Reserva #" + reserva.getIdReserva() + " registrada")
                    .estado(reserva.getEstado() != null ? reserva.getEstado() : "OK")
                    .build());
        }

        for (Incidencia incidencia : incidenciaRepository.findTop5ByOrderByFechaRegistroDesc()) {
            LocalDateTime fecha = incidencia.getFechaRegistro() != null
                    ? incidencia.getFechaRegistro()
                    : LocalDateTime.now();
            items.add(ActividadRecienteDTO.builder()
                    .hora(fecha.toLocalTime().format(horaFmt))
                    .evento("Incidencia: " + safe(incidencia.getTipo(), incidencia.getDescripcion()))
                    .estado(incidencia.getEstado() != null ? incidencia.getEstado() : "PENDIENTE")
                    .build());
        }

        items.sort((a, b) -> b.getHora().compareTo(a.getHora()));
        return items.stream().limit(8).toList();
    }

    private String safe(String titulo, String descripcion) {
        if (titulo != null && !titulo.isBlank()) {
            return titulo;
        }
        if (descripcion != null && !descripcion.isBlank()) {
            return descripcion.length() > 40
                    ? descripcion.substring(0, 40) + "…"
                    : descripcion;
        }
        return "Sin detalle";
    }

    @Override
    public DashboardAlumnoDTO obtenerDashboardAlumno(Long idUsuario) {

        DashboardAlumnoDTO dto = new DashboardAlumnoDTO();

        Alumno alumno = alumnoRepository
                .findByUsuario_IdUsuario(idUsuario)
                .orElse(null);

        if (alumno == null) {
            return dto;
        }

        dto.setMisReservas(
                reservaRepository.countByAlumno_IdAlumno(alumno.getIdAlumno()));

        Reserva reserva = reservaRepository
                .findFirstByAlumno_IdAlumnoOrderByIdReservaDesc(alumno.getIdAlumno())
                .orElse(null);

        if (reserva != null) {
            Viaje viaje = reserva.getViaje();
            if (viaje != null) {
                dto.setIdViaje(viaje.getIdViaje());
                dto.setEstadoBus(viaje.getEstado());
                if (viaje.getProgramacion() != null) {
                    dto.setProximoViaje(
                            viaje.getProgramacion().getHoraSalida().toString());
                    dto.setHoraLlegadaBus(
                            viaje.getProgramacion().getHoraLlegadaEstimada().toString());
                    if (viaje.getProgramacion().getRuta() != null) {
                        dto.setRuta(viaje.getProgramacion().getRuta().getNombre());
                        dto.setIdRuta(viaje.getProgramacion().getRuta().getIdRuta());
                        dto.setCodigoRuta(viaje.getProgramacion().getRuta().getCodigo());
                    }
                }
            }
        } else {
            dto.setProximoViaje("--:--");
            dto.setEstadoBus("SIN RESERVA");
            dto.setRuta("No asignada");
            dto.setHoraLlegadaBus("--:--");
        }

        dto.setNotificaciones(
                notificacionRepository.countByUsuario_IdUsuarioAndLeido(idUsuario, false));
        dto.setParadero(
                reserva != null && reserva.getParadero() != null
                        ? reserva.getParadero().getNombre()
                        : "Pendiente");

        return dto;
    }

    @Override
    public DashboardChoferDTO obtenerDashboardChofer(Long idUsuario) {

        DashboardChoferDTO dto = new DashboardChoferDTO();

        Chofer chofer = choferRepository
                .findByUsuario_IdUsuario(idUsuario)
                .orElse(null);

        if (chofer == null) {
            return dto;
        }

        LocalDate hoy = LocalDate.now(ZoneId.of("America/Lima"));

        long pendientes = viajeRepository.countByChofer_IdChoferAndFechaViajeAndEstadoIn(
                chofer.getIdChofer(), hoy, List.of("PROGRAMADO", "EN_CURSO", "EN_RUTA"));
        long completados = viajeRepository.countByChofer_IdChoferAndFechaViajeAndEstadoIn(
                chofer.getIdChofer(), hoy, List.of("FINALIZADO", "COMPLETADO"));

        dto.setViajesPendientesHoy(pendientes);
        dto.setViajesCompletadosHoy(completados);

        if (pendientes == 0) {
            dto.setBusAsignado(completados > 0 ? "—" : "Sin asignar");
            dto.setRuta(completados > 0 ? "Jornada completada" : "Sin programación");
            dto.setEstadoViaje(completados > 0 ? "JORNADA_COMPLETA" : "SIN VIAJE");
            dto.setHoraSalida("--:--");
            dto.setHoraLlegada("--:--");
            dto.setPasajeros(0L);
            dto.setAsientosDisponibles(0L);
            dto.setIncidenciasHoy(0L);
            dto.setMensajeJornada(completados > 0
                    ? "Completaste todos tus viajes del día (" + completados + ")."
                    : "No tienes viajes programados para hoy.");
            return dto;
        }

        Viaje viaje = viajeRepository
                .findFirstByChofer_IdChoferAndEstado(chofer.getIdChofer(), "EN_CURSO")
                .or(() -> viajeRepository.findFirstByChofer_IdChoferAndEstado(
                        chofer.getIdChofer(), "EN_RUTA"))
                .orElseGet(() -> viajeRepository
                        .findByChofer_IdChoferAndFechaViajeOrderByProgramacion_HoraSalidaAsc(
                                chofer.getIdChofer(), hoy)
                        .stream()
                        .filter(v -> "PROGRAMADO".equalsIgnoreCase(v.getEstado())
                                || "EN_CURSO".equalsIgnoreCase(v.getEstado())
                                || "EN_RUTA".equalsIgnoreCase(v.getEstado()))
                        .findFirst()
                        .orElse(null));

        dto.setViajesPendientesHoy(pendientes);
        dto.setViajesCompletadosHoy(completados);

        if (viaje == null) {
            dto.setBusAsignado("Sin asignar");
            dto.setRuta("Sin programación");
            dto.setEstadoViaje("SIN VIAJE");
            dto.setHoraSalida("--:--");
            dto.setHoraLlegada("--:--");
            dto.setPasajeros(0L);
            dto.setAsientosDisponibles(0L);
            dto.setIncidenciasHoy(0L);
            dto.setMensajeJornada(completados > 0
                    ? "Completaste " + completados + " viaje(s) hoy."
                    : "No tienes viajes programados para hoy.");
            return dto;
        }

        if (viaje.getBus() != null) {
            dto.setBusAsignado(viaje.getBus().getCodigo());
            long pasajeros = viaje.getReservas() == null ? 0 : viaje.getReservas().size();
            dto.setPasajeros(pasajeros);
            dto.setAsientosDisponibles(
                    (long) viaje.getBus().getCapacidadAsientos() - pasajeros);
        }

        if (viaje.getProgramacion() != null) {
            if (viaje.getProgramacion().getRuta() != null) {
                dto.setRuta(viaje.getProgramacion().getRuta().getNombre());
                dto.setIdRuta(viaje.getProgramacion().getRuta().getIdRuta());
                dto.setCodigoRuta(viaje.getProgramacion().getRuta().getCodigo());
            }
            dto.setHoraSalida(viaje.getProgramacion().getHoraSalida().toString());
            dto.setHoraLlegada(viaje.getProgramacion().getHoraLlegadaEstimada().toString());
        }

        dto.setEstadoViaje(viaje.getEstado());
        dto.setIdViaje(viaje.getIdViaje());
        dto.setIncidenciasHoy(
                viaje.getIncidencias() == null ? 0L : (long) viaje.getIncidencias().size());

        if (pendientes > 1) {
            dto.setMensajeJornada("Tienes " + pendientes + " viaje(s) pendiente(s) hoy.");
        } else if (pendientes == 1 && "FINALIZADO".equalsIgnoreCase(viaje.getEstado())) {
            dto.setMensajeJornada("Completaste todos tus viajes del día.");
        } else if (pendientes == 0 && completados > 0) {
            dto.setMensajeJornada("Completaste todos tus viajes del día (" + completados + ").");
        } else {
            dto.setMensajeJornada("Viaje actual: " + viaje.getEstado());
        }

        return dto;
    }
}
