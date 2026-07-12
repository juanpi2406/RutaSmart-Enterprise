package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChoferDTO {

    private Long idChofer;

    private Long idUsuario;

    private String codigo;

    private String nombres;

    private String apellidos;

    private String correo;

    private String telefono;

    private String numeroLicencia;

    private String categoriaLicencia;

    private LocalDate fechaVencimiento;

    private Boolean estado;

}
