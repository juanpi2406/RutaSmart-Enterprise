package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dashboard del Administrador.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAdminDTO {

    /**
     * Usuarios registrados.
     */
    private Long totalUsuarios;

    /**
     * Alumnos registrados.
     */
    private Long totalAlumnos;

    /**
     * Choferes registrados.
     */
    private Long totalChoferes;

    /**
     * Buses registrados.
     */
    private Long totalBuses;

    /**
     * Reservas registradas.
     */
    private Long totalReservas;

    /**
     * Viajes activos.
     */
    private Long viajesActivos;

    /**
     * Incidencias pendientes.
     */
    private Long incidenciasPendientes;

    private Long busesOperativos;

    private Long busesMantenimiento;

    private java.util.List<ReservaPorDiaDTO> reservasPorDia;

    private java.util.List<ActividadRecienteDTO> actividadReciente;

}