package com.rutasmart.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LimpiezaSinGpsDTO {

    private int rutasEliminadas;
    private int programacionesEliminadas;
    private int viajesEliminados;
    private List<String> rutas;
    private String mensaje;

}
