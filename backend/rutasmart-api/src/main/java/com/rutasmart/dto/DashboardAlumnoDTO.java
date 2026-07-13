package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Dashboard del Alumno.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAlumnoDTO {

    /**
     * Próximo viaje programado.
     * Ejemplo: "17:00"
     */
    private String proximoViaje;

    /**
     * Estado del bus.
     * Ejemplo:
     * EN RUTA
     * PENDIENTE
     * FINALIZADO
     */
    private String estadoBus;

    /**
     * Cantidad de reservas activas del alumno.
     */
    private Long misReservas;

    /**
     * Cantidad de notificaciones pendientes.
     */
    private Long notificaciones;

    /**
     * Nombre de la ruta asignada.
     */
    private String ruta;

    /**
     * Nombre del paradero de embarque.
     */
    private String paradero;

    /**
     * Hora estimada de llegada del bus.
     */
    private String horaLlegadaBus;

}