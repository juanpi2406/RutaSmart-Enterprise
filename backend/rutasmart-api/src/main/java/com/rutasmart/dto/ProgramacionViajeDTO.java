package com.rutasmart.dto;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramacionViajeDTO {

    private Long idProgramacion;

    private Long idRuta;

    private LocalTime horaSalida;

    private LocalTime horaLlegadaEstimada;

    private String diasOperacion;

    private Boolean estado;

}