package com.rutasmart.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RutaDTO {

    private Long idRuta;

    private String codigo;

    private String nombre;

    private String origen;

    private String destino;

    private String descripcion;

    private BigDecimal distanciaKm;

    private Short tiempoEstimadoMin;

    private Boolean estado;

}