package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidenciaDTO {

    private Long idIncidencia;

    private Long idUsuario;

    private Long idViaje;

    private String tipo;

    private String descripcion;

    private String estado;

    private LocalDateTime fechaRegistro;

    private java.math.BigDecimal latitud;

    private java.math.BigDecimal longitud;

}