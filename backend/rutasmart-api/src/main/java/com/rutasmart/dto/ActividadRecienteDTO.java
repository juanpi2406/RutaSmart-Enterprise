package com.rutasmart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActividadRecienteDTO {

    private String hora;
    private String evento;
    private String estado;
}
