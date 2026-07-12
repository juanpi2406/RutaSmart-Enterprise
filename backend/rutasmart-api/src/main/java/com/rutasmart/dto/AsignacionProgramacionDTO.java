package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignacionProgramacionDTO {

    private Long idAsignacion;

    private Long idProgramacion;

    private Long idBus;

    private Long idChofer;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Boolean estado;

}