package com.rutasmart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioCreateDTO {

    /*=========================================
     * DATOS DEL USUARIO
     =========================================*/

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

    private String password;

    @NotNull(message = "Debe seleccionar un rol.")
    private Long idRol;

    @NotNull(message = "Debe indicar el estado.")
    private Boolean estado;

    /*=========================================
     * DATOS DEL ALUMNO
     * (Solo se usan cuando el rol es ALUMNO)
     =========================================*/

    private String codigoUniversitario;

    private String facultad;

    private String sede;

    private Short ciclo;

    /*=========================================
     * DATOS DEL CHOFER
     * (Solo se usan cuando el rol es CHOFER)
     =========================================*/

    private String numeroLicencia;

    private String categoriaLicencia;

    private LocalDate fechaVencimiento;

}