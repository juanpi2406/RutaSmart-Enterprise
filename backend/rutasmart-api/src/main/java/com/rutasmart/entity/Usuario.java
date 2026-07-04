package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    /*=========================================
     * PRIMARY KEY
     =========================================*/

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    /*=========================================
     * DATOS PERSONALES
     =========================================*/

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(length = 20)
    private String telefono;

    /*=========================================
     * RELACIÓN CON ROL
     =========================================*/

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    /*=========================================
     * ESTADO
     =========================================*/

    @Column(nullable = false)
    @Builder.Default
    private Boolean estado = true;

    /*=========================================
     * ÚLTIMO LOGIN
     =========================================*/

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

    /*=========================================
     * AUDITORÍA
     =========================================*/

    @Column(name = "created_at",
            insertable = false,
            updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at",
            insertable = false)
    private LocalDateTime updatedAt;

}