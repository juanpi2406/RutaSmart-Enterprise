package com.rutasmart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumnoDTO {

    private Long idAlumno;

    private Long idUsuario;

    private String codigoUniversitario;

    private String facultad;

    private String sede;

    private Short ciclo;

    private Boolean estado;

}