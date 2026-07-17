package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dashboard del Chofer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardChoferDTO {

    /**
     * Código del bus asignado.
     * Ejemplo: BUS-01
     */
    private String busAsignado;

    /**
     * Ruta asignada.
     * Ejemplo: Ruta Norte
     */
    private String ruta;

    /**
     * Estado del viaje.
     * Ejemplo:
     * PROGRAMADO
     * EN_RUTA
     * FINALIZADO
     */
    private String estadoViaje;

    /**
     * Hora de salida programada.
     */
    private String horaSalida;

    /**
     * Hora estimada de llegada.
     */
    private String horaLlegada;

    /**
     * Cantidad de pasajeros registrados.
     */
    private Long pasajeros;

    /**
     * Cantidad de asientos disponibles.
     */
    private Long asientosDisponibles;

    /**
     * Cantidad de incidencias del día.
     */
    private Long incidenciasHoy;

}