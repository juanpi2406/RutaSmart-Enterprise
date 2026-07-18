package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ViajeDTO {

    private Long idViaje;

    private Long idProgramacion;

    private Long idBus;

    private Long idChofer;

    private LocalDate fechaViaje;

    private LocalDateTime horaInicioReal;

    private LocalDateTime horaFinReal;

    private String estado;

    private String observaciones;

    private String horaSalida;

    private String horaLlegadaEstimada;

    private Long idRuta;

    private String codigoRuta;

    private String nombreRuta;

}