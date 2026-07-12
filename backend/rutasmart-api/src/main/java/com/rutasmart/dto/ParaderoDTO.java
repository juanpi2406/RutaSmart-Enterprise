package com.rutasmart.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParaderoDTO {

    private Long idParadero;

    private Long idRuta;

    private String nombre;

    private String direccion;

    private BigDecimal latitud;

    private BigDecimal longitud;

    private Short orden;

    private Short tiempoEstimadoMin;

    private Boolean estado;

}