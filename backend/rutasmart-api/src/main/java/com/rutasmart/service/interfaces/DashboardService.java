package com.rutasmart.service.interfaces;

import com.rutasmart.dto.DashboardAdminDTO;
import com.rutasmart.dto.DashboardAlumnoDTO;
import com.rutasmart.dto.DashboardChoferDTO;

/**
 * Servicio para obtener la información de los dashboards
 * según el rol del usuario.
 */
public interface DashboardService {

    /**
     * Dashboard del Administrador.
     */
    DashboardAdminDTO obtenerDashboardAdmin();

    /**
     * Dashboard del Alumno.
     *
     * @param idUsuario ID del usuario autenticado.
     */
    DashboardAlumnoDTO obtenerDashboardAlumno(Long idUsuario);

    /**
     * Dashboard del Chofer.
     *
     * @param idUsuario ID del usuario autenticado.
     */
    DashboardChoferDTO obtenerDashboardChofer(Long idUsuario);

}