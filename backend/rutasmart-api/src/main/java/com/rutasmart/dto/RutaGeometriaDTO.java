package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RutaGeometriaDTO {

    private Long idRuta;
    private String codigo;
    private String nombre;
    private String origen;
    private String destino;
    private boolean mapeable;
    private String mensaje;
    private List<PuntoRutaDTO> marcadores;
    private List<PuntoRutaDTO> puntos;
}
