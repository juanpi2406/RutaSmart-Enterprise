package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtaDTO {

    private Long idViaje;
    private Long idParadero;
    private Integer minutosEstimados;
    private Integer paradasRestantes;
    private Double distanciaMetros;
    private String mensaje;
}
