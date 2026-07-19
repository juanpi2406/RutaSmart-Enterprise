package com.rutasmart.service;

import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;
import com.rutasmart.exception.BusinessException;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.service.interfaces.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
@Slf4j
public class AsistenciaReservaService {

    private static final int MAX_INASISTENCIAS = 3;
    private static final int DIAS_SANCION = 7;
    private static final Set<String> ESTADOS_ASISTIO = Set.of("ABORDADO");
    private static final Set<String> ESTADOS_CANCELADOS = Set.of("CANCELADO", "CANCELADA");

    private final ReservaRepository reservaRepository;
    private final NotificacionService notificacionService;

    @Transactional
    public void marcarInasistencias(Viaje viaje) {
        if (viaje == null || viaje.getIdViaje() == null) return;

        List<Reserva> reservas = reservaRepository.findByViaje_IdViaje(viaje.getIdViaje());
        for (Reserva reserva : reservas) {
            String estado = reserva.getEstado() != null ? reserva.getEstado().toUpperCase(Locale.ROOT) : "";
            if (ESTADOS_ASISTIO.contains(estado) || ESTADOS_CANCELADOS.contains(estado) || "NO_ASISTIO".equals(estado)) {
                continue;
            }
            reserva.setEstado("NO_ASISTIO");
            reservaRepository.save(reserva);
            evaluarSancion(reserva.getAlumno());
        }
    }

    public void validarPuedeReservar(Alumno alumno) {
        if (alumno == null) return;

        long inasistencias = reservaRepository.countByAlumno_IdAlumnoAndEstado(
                alumno.getIdAlumno(), "NO_ASISTIO");

        if (inasistencias < MAX_INASISTENCIAS) return;

        LocalDate bloqueadoHasta = calcularFinSancion(alumno.getIdAlumno());
        if (!LocalDate.now().isAfter(bloqueadoHasta)) {
            throw new BusinessException(
                    "Tienes " + inasistencias + " inasistencias registradas. "
                            + "No puedes reservar hasta el "
                            + bloqueadoHasta.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                            + ".");
        }
    }

    public long contarInasistencias(Long idAlumno) {
        return reservaRepository.countByAlumno_IdAlumnoAndEstado(idAlumno, "NO_ASISTIO");
    }

    public LocalDate calcularFinSancion(Long idAlumno) {
        List<Reserva> inasistencias = reservaRepository
                .findByAlumno_IdAlumnoAndEstadoOrderByViaje_FechaViajeDesc(idAlumno, "NO_ASISTIO");

        if (inasistencias.size() < MAX_INASISTENCIAS) {
            return LocalDate.now().minusDays(1);
        }

        Reserva tercera = inasistencias.get(MAX_INASISTENCIAS - 1);
        LocalDate fechaReferencia = tercera.getViaje() != null
                ? tercera.getViaje().getFechaViaje()
                : LocalDate.now();
        return fechaReferencia.plusDays(DIAS_SANCION);
    }

    public boolean estaSancionado(Long idAlumno) {
        if (contarInasistencias(idAlumno) < MAX_INASISTENCIAS) return false;
        return !LocalDate.now().isAfter(calcularFinSancion(idAlumno));
    }

    private void evaluarSancion(Alumno alumno) {
        if (alumno == null || alumno.getUsuario() == null) return;

        long total = contarInasistencias(alumno.getIdAlumno());
        try {
            if (total < MAX_INASISTENCIAS) {
                notificacionService.enviar(
                        alumno.getUsuario().getIdUsuario(),
                        "Inasistencia registrada",
                        "No asististe a tu reserva. Llevas " + total + " de " + MAX_INASISTENCIAS
                                + " inasistencias antes de una sanción.",
                        "RESERVA"
                );
                return;
            }

            LocalDate hasta = calcularFinSancion(alumno.getIdAlumno());
            notificacionService.enviar(
                    alumno.getUsuario().getIdUsuario(),
                    "Reservas suspendidas",
                    "Alcanzaste " + MAX_INASISTENCIAS + " inasistencias. No podrás reservar hasta el "
                            + hasta.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + ".",
                    "SANCION"
            );
        } catch (Exception ex) {
            log.warn("Inasistencia registrada, pero falló la notificación al alumno {}: {}",
                    alumno.getIdAlumno(), ex.getMessage());
        }
    }

    public LocalDateTime horaAbordajeProgramada(Viaje viaje) {
        if (viaje == null || viaje.getProgramacion() == null || viaje.getFechaViaje() == null) {
            return null;
        }
        if (viaje.getProgramacion().getHoraSalida() == null) return null;
        return LocalDateTime.of(viaje.getFechaViaje(), viaje.getProgramacion().getHoraSalida());
    }
}
