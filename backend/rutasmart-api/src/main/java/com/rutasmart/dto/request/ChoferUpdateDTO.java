package com.rutasmart.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChoferUpdateDTO {

    /*=========================================
     * DATOS DEL USUARIO
     =========================================*/


    /*=========================================
     * DATOS DEL CHOFER
     =========================================*/

    private String numeroLicencia;

    private String categoriaLicencia;

    private LocalDate fechaVencimiento;



    /*=========================================
     * ESTADO
     =========================================*/

    private Boolean estado;

}