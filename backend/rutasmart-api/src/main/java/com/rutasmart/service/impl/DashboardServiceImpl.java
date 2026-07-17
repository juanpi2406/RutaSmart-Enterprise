package com.rutasmart.service.impl;

import com.rutasmart.dto.DashboardAdminDTO;
import com.rutasmart.dto.DashboardAlumnoDTO;
import com.rutasmart.dto.DashboardChoferDTO;

import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Chofer;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;

import com.rutasmart.repository.AlumnoRepository;
import com.rutasmart.repository.BusRepository;
import com.rutasmart.repository.ChoferRepository;
import com.rutasmart.repository.IncidenciaRepository;
import com.rutasmart.repository.ReservaRepository;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.repository.ViajeRepository;

import com.rutasmart.service.interfaces.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    /*====================================================
     * REPOSITORIES
     ====================================================*/

    private final UsuarioRepository usuarioRepository;

    private final AlumnoRepository alumnoRepository;

    private final ChoferRepository choferRepository;

    private final BusRepository busRepository;

    private final ReservaRepository reservaRepository;

    private final ViajeRepository viajeRepository;

    private final IncidenciaRepository incidenciaRepository;

    /*====================================================
     * DASHBOARD ADMINISTRADOR
     ====================================================*/

    @Override
    public DashboardAdminDTO obtenerDashboardAdmin() {

        DashboardAdminDTO dto = new DashboardAdminDTO();

        dto.setTotalUsuarios(
                usuarioRepository.count());

        dto.setTotalAlumnos(
                alumnoRepository.count());

        dto.setTotalChoferes(
                choferRepository.count());

        dto.setTotalBuses(
                busRepository.count());

        dto.setTotalReservas(
                reservaRepository.count());

        dto.setViajesActivos(
                viajeRepository.countByEstado("EN_RUTA"));

        dto.setIncidenciasPendientes(
                incidenciaRepository.countByEstado("PENDIENTE"));

        return dto;

    }


    /*====================================================
     * DASHBOARD ALUMNO
     ====================================================*/

    @Override
    public DashboardAlumnoDTO obtenerDashboardAlumno(Long idUsuario) {

        DashboardAlumnoDTO dto = new DashboardAlumnoDTO();

        Alumno alumno = alumnoRepository
                .findByUsuario_IdUsuario(idUsuario)
                .orElse(null);

        if (alumno == null) {
            return dto;
        }

        // ==========================
        // Reservas del alumno
        // ==========================

        dto.setMisReservas(
                reservaRepository.countByAlumno_IdAlumno(
                        alumno.getIdAlumno()
                )
        );

        // ==========================
        // Última reserva registrada
        // ==========================

        Reserva reserva = reservaRepository
                .findFirstByAlumno_IdAlumnoOrderByIdReservaDesc(
                        alumno.getIdAlumno()
                )
                .orElse(null);

        if (reserva != null) {

            Viaje viaje = reserva.getViaje();

            if (viaje != null) {

                dto.setEstadoBus(
                        viaje.getEstado()
                );

                if (viaje.getProgramacion() != null) {

                    dto.setProximoViaje(
                            viaje.getProgramacion()
                                    .getHoraSalida()
                                    .toString()
                    );

                    dto.setHoraLlegadaBus(
                            viaje.getProgramacion()
                                    .getHoraLlegadaEstimada()
                                    .toString()
                    );

                    if (viaje.getProgramacion().getRuta() != null) {

                        dto.setRuta(
                                viaje.getProgramacion()
                                        .getRuta()
                                        .getNombre()
                        );

                    }

                }

            }

        } else {

            dto.setProximoViaje("--:--");

            dto.setEstadoBus("SIN RESERVA");

            dto.setRuta("No asignada");

            dto.setHoraLlegadaBus("--:--");

        }

        /*
         * Próximamente:
         * Sistema de notificaciones
         */

        dto.setNotificaciones(0L);

        dto.setParadero("Pendiente");

        return dto;

    }

    /*====================================================
     * DASHBOARD CHOFER
     ====================================================*/

    @Override
    public DashboardChoferDTO obtenerDashboardChofer(Long idUsuario) {

        DashboardChoferDTO dto = new DashboardChoferDTO();

        Chofer chofer = choferRepository
                .findByUsuario_IdUsuario(idUsuario)
                .orElse(null);

        if (chofer == null) {
            return dto;
        }

        /*
         * Busca el viaje que actualmente está EN_RUTA.
         * Si no existe, toma el último viaje del chofer.
         */
        Viaje viaje = viajeRepository
                .findFirstByChofer_IdChoferAndEstado(
                        chofer.getIdChofer(),
                        "EN_RUTA"
                )
                .orElseGet(() ->
                        viajeRepository
                                .findFirstByChofer_IdChoferOrderByFechaViajeDesc(
                                        chofer.getIdChofer()
                                )
                                .orElse(null)
                );

        if (viaje == null) {

            dto.setBusAsignado("Sin asignar");
            dto.setRuta("Sin programación");
            dto.setEstadoViaje("SIN VIAJE");
            dto.setHoraSalida("--:--");
            dto.setHoraLlegada("--:--");
            dto.setPasajeros(0L);
            dto.setAsientosDisponibles(0L);
            dto.setIncidenciasHoy(0L);

            return dto;
        }

        /*=========================================
         * BUS
         =========================================*/

        if (viaje.getBus() != null) {

            dto.setBusAsignado(
                    viaje.getBus().getCodigo()
            );

            long pasajeros =
                    viaje.getReservas() == null
                            ? 0
                            : viaje.getReservas().size();

            dto.setPasajeros(pasajeros);

            dto.setAsientosDisponibles(

                    (long) viaje.getBus().getCapacidadAsientos()

                            - pasajeros

            );

        }

        /*=========================================
         * PROGRAMACIÓN
         =========================================*/

        if (viaje.getProgramacion() != null) {

            dto.setRuta(

                    viaje.getProgramacion()

                            .getRuta()

                            .getNombre()

            );

            dto.setHoraSalida(

                    viaje.getProgramacion()

                            .getHoraSalida()

                            .toString()

            );

            dto.setHoraLlegada(

                    viaje.getProgramacion()

                            .getHoraLlegadaEstimada()

                            .toString()

            );

        }

        /*=========================================
         * VIAJE
         =========================================*/

        dto.setEstadoViaje(

                viaje.getEstado()

        );

        /*=========================================
         * INCIDENCIAS
         =========================================*/

        dto.setIncidenciasHoy(

                (long) viaje.getIncidencias().size()

        );

        return dto;

    }

}