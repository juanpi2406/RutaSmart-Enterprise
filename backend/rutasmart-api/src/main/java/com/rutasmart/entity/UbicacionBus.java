package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ubicacion_bus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionBus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ubicacion")
    private Long idUbicacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_viaje", nullable = false)
    private Viaje viaje;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitud;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitud;

    @Column(precision = 5, scale = 2)
    private BigDecimal velocidad;

    @Column(name = "fecha_hora", insertable = false, updatable = false)
    private LocalDateTime fechaHora;

}