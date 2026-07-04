package com.rutasmart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolDTO {

    private Long idRol;

    private String nombre;

    private String descripcion;

    private Boolean estado;

}