package com.rutasmart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusDTO {

    private Long idBus;

    private String codigo;

    private String placa;

    private String marca;

    private String modelo;

    private Short anio;

    private String color;

    private Short capacidadAsientos;

    private String observaciones;

    private Boolean estado;

}