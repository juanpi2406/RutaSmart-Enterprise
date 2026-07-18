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

    /** ID del viaje activo o más reciente. */
    private Long idViaje;

    /** ID de la ruta asignada. */
    private Long idRuta;

    /** Código de la ruta (ej. R-03). */
    private String codigoRuta;

    /** Viajes pendientes hoy (PROGRAMADO / EN_CURSO). */
    private Long viajesPendientesHoy;

    /** Viajes finalizados hoy. */
    private Long viajesCompletadosHoy;

    /** Mensaje de estado de la jornada. */
    private String mensajeJornada;

}