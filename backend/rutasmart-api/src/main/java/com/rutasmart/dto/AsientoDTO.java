package com.rutasmart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsientoDTO {

    private Long idAsiento;

    private Long idViaje;

    private Short numeroAsiento;

    private Boolean estado;

}
