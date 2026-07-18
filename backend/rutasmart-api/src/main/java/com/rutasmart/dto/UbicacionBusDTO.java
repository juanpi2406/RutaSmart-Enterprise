package com.rutasmart.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionBusDTO {

    private Long idUbicacion;

    private Long idViaje;

    private BigDecimal latitud;

    private BigDecimal longitud;

    private BigDecimal velocidad;

    private LocalDateTime fechaHora;

    /** Código de la ruta del viaje (para tracking en mapa). */
    private String codigoRuta;

}