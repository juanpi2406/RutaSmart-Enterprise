package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asignacion_programacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignacionProgramacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    private Long idAsignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_programacion", nullable = false)
    private ProgramacionViaje programacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_bus", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chofer", nullable = false)
    private Chofer chofer;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

}