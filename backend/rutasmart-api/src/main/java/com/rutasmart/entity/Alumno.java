package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import java.util.List;

@Entity
@Table(name = "alumnos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alumno {

    /*=========================================
     * PRIMARY KEY
     =========================================*/

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alumno")
    private Long idAlumno;

    /*=========================================
     * RELACIÓN CON USUARIO
     =========================================*/

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    /*=========================================
     * INFORMACIÓN ACADÉMICA
     =========================================*/

    @Column(name = "codigo_universitario", length = 20)
    private String codigoUniversitario;

    @Column(length = 100)
    private String facultad;

    // Si tu BD aún tiene "escuela", cambia el nombre de la columna.
    @Column(length = 100)
    private String sede;

    @Column
    private Short ciclo;

    /*=========================================
     * ESTADO
     =========================================*/

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;

    /*=========================================
     * AUDITORÍA
     =========================================*/

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "alumno",
        fetch = FetchType.LAZY)
private List<Reserva> reservas;

}