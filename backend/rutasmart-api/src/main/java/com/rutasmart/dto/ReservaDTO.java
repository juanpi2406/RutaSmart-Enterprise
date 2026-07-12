package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaDTO {

    private Long idReserva;

    private Long idAlumno;

    private Long idViaje;

    private Long idParadero;

    private LocalDateTime fechaReserva;

    private LocalDateTime fechaAbordaje;

    private String codigoQr;

    private String estado;

    private Short numeroAsiento;

}