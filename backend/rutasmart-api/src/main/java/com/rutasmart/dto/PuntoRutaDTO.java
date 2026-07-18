package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PuntoRutaDTO {

    private double lat;
    private double lng;
    private String etiqueta;
    /** origen | paradero | destino | trayecto */
    private String tipo;
    private Integer numero;
}
