package com.rutasmart.controller;

import com.rutasmart.dto.DashboardAdminDTO;
import com.rutasmart.dto.DashboardAlumnoDTO;
import com.rutasmart.dto.DashboardChoferDTO;
import com.rutasmart.service.interfaces.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para los dashboards del sistema.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    /*====================================================
     * DASHBOARD ADMINISTRADOR
     ====================================================*/

    @GetMapping("/admin")
    public ResponseEntity<DashboardAdminDTO> dashboardAdmin() {

        return ResponseEntity.ok(
                dashboardService.obtenerDashboardAdmin()
        );

    }

    /*====================================================
     * DASHBOARD ALUMNO
     ====================================================*/

    @GetMapping("/alumno/{idUsuario}")
    public ResponseEntity<DashboardAlumnoDTO> dashboardAlumno(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                dashboardService.obtenerDashboardAlumno(idUsuario)
        );

    }

    /*====================================================
     * DASHBOARD CHOFER
     ====================================================*/

    @GetMapping("/chofer/{idUsuario}")
    public ResponseEntity<DashboardChoferDTO> dashboardChofer(
            @PathVariable Long idUsuario) {

        return ResponseEntity.ok(
                dashboardService.obtenerDashboardChofer(idUsuario)
        );

    }

}