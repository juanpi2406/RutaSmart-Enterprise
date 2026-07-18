package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapacidadViajeDTO {

    private Long idViaje;
    private Short capacidad;
    private Long ocupados;
    private Long disponibles;
}
