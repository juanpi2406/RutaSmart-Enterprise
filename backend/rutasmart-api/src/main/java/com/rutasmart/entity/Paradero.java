package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "paraderos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Paradero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paradero")
    private Long idParadero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ruta", nullable = false)
    private Ruta ruta;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(length = 250)
    private String direccion;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitud;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitud;

    @Column(nullable = false)
    private Short orden;

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

    @OneToMany(mappedBy = "paradero",
        fetch = FetchType.LAZY)
    private List<Reserva> reservas;
}
