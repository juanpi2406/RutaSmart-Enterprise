package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;


    @Entity
    @Table(name = "programacion_viajes")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
public class ProgramacionViaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_programacion")
    private Long idProgramacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ruta", nullable = false)
    private Ruta ruta;

    @Column(name = "hora_salida", nullable = false)
    private LocalTime horaSalida;

    @Column(name = "hora_llegada_estimada", nullable = false)
    private LocalTime horaLlegadaEstimada;

    @Column(name = "dias_operacion", nullable = false, length = 100)
    private String diasOperacion;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "programacion",
        fetch = FetchType.LAZY)
    private List<Viaje> viajes;

    @OneToMany(mappedBy = "programacion",
            fetch = FetchType.LAZY)
    private List<AsignacionProgramacion> asignaciones;
}
