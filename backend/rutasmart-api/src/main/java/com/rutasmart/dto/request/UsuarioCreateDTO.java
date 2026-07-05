package com.rutasmart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioCreateDTO {

    @NotBlank(message = "El código es obligatorio.")
    private String codigo;

    @NotBlank(message = "Los nombres son obligatorios.")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios.")
    private String apellidos;

    @Email(message = "Correo inválido.")
    @NotBlank(message = "El correo es obligatorio.")
    private String correo;

    @NotBlank(message = "El teléfono es obligatorio.")
    private String telefono;

    @NotBlank(message = "La contraseña es obligatoria.")
    private String password;

    @NotNull(message = "Debe seleccionar un rol.")
    private Long idRol;

    @NotNull(message = "Debe indicar el estado.")
    private Boolean estado;

}