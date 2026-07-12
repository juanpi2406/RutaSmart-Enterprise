package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "buses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bus")
    private Long idBus;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, unique = true, length = 15)
    private String placa;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(length = 50)
    private String modelo;

    private Short anio;

    @Column(length = 30)
    private String color;

    @Column(name = "capacidad_asientos", nullable = false)
    private Short capacidadAsientos;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Builder.Default
    @Column(nullable = false)
    private Boolean estado = true;

    @Column(name = "created_at",
            insertable = false,
            updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at",
            insertable = false)
    private LocalDateTime updatedAt;




@OneToMany(mappedBy = "bus",
        fetch = FetchType.LAZY)
private List<Viaje> viajes;

@OneToMany(mappedBy = "bus",
        fetch = FetchType.LAZY)
private List<AsignacionProgramacion> asignaciones;

}