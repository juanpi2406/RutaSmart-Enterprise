package com.rutasmart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long idUsuario;

    private String codigo;

    private String nombres;

    private String apellidos;

    private String correo;

    private String rol;

    private Boolean estado;

}