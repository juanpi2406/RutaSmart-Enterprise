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

<<<<<<< HEAD
    private String codigo;

    private String nombres;

    private String apellidos;

    private String correo;

    private String telefono;

    private String numeroLicencia;
=======
    private String licencia;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

    private String categoriaLicencia;

    private LocalDate fechaVencimiento;

<<<<<<< HEAD

=======
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    private Boolean estado;

}