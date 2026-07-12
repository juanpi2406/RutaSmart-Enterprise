package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidencia")
    private Long idIncidencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_viaje")
    private Viaje viaje;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "fecha_registro", insertable = false, updatable = false)
    private LocalDateTime fechaRegistro;

}