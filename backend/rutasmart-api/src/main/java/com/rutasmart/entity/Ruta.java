package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rutas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Long idRuta;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(length = 120)
    private String origen;

    @Column(length = 120)
    private String destino;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "distancia_km", precision = 6, scale = 2)
    private BigDecimal distanciaKm;

    @Column(name = "tiempo_estimado_min")
    private Short tiempoEstimadoMin;

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

    /*=========================================
     * RELACIONES
     =========================================*/

    @OneToMany(mappedBy = "ruta", fetch = FetchType.LAZY)
    private List<Paradero> paraderos;

    @OneToMany(mappedBy = "ruta", fetch = FetchType.LAZY)
    private List<ProgramacionViaje> programaciones;

}