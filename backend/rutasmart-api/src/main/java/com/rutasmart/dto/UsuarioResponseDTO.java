package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long idUsuario;

    private String codigo;

    private String nombres;

    private String apellidos;

    private String correo;

    private String telefono;

    private Boolean estado;

    private Long idRol;

    private String nombreRol;

    private LocalDateTime ultimoLogin;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}