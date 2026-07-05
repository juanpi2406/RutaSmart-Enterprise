package com.rutasmart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {

    /**
     * Identificador del usuario
     */
    private Long idUsuario;

    /**
     * Código institucional
     */
    @NotBlank(message = "El código es obligatorio.")
    @Size(max = 20, message = "El código no puede superar los 20 caracteres.")
    private String codigo;

    /**
     * Nombres
     */
    @NotBlank(message = "Los nombres son obligatorios.")
    @Size(max = 100, message = "Los nombres no pueden superar los 100 caracteres.")
    private String nombres;

    /**
     * Apellidos
     */
    @NotBlank(message = "Los apellidos son obligatorios.")
    @Size(max = 100, message = "Los apellidos no pueden superar los 100 caracteres.")
    private String apellidos;

    /**
     * Correo electrónico
     */
    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo electrónico no es válido.")
    @Size(max = 150, message = "El correo no puede superar los 150 caracteres.")
    private String correo;

    /**
     * Teléfono
     */
    @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres.")
    private String telefono;

    /**
     * Rol asignado
     */
    private Long idRol;

    private String nombreRol;

    /**
     * Estado del usuario
     */
    private Boolean estado;

}