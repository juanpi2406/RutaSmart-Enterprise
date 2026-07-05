package com.rutasmart.dto.request;

import lombok.*;

import java.time.LocalDate;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder



public class ChoferCreateDTO {

    /*=========================================
     * DATOS DEL USUARIO
     =========================================*/
    private Long idUsuario;


    /*=========================================
     * DATOS DEL CHOFER
     =========================================*/

    private String numeroLicencia;

    private String categoriaLicencia;

    private LocalDate fechaVencimiento;



    /*=========================================
     * ESTADO
     =========================================*/

    @Builder.Default
    private Boolean estado = true;

}