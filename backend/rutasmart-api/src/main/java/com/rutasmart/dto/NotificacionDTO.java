package com.rutasmart.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificacionDTO {

    private Long idNotificacion;

    private Long idUsuario;

    private String titulo;

    private String mensaje;

    private String tipo;

    private Boolean leido;

    private LocalDateTime fechaEnvio;

}