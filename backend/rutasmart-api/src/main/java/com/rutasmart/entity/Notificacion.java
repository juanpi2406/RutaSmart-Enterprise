package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Long idNotificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Column(length = 30)
    private String tipo;

    @Builder.Default
    @Column(nullable = false)
    private Boolean leido = false;

    @Column(name = "fecha_envio", insertable = false, updatable = false)
    private LocalDateTime fechaEnvio;

}