package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long idReserva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alumno", nullable = false)
    private Alumno alumno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_viaje", nullable = false)
    private Viaje viaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paradero", nullable = false)
    private Paradero paradero;

    @Column(name = "fecha_reserva", insertable = false, updatable = false)
    private LocalDateTime fechaReserva;

    @Column(name = "fecha_abordaje")
    private LocalDateTime fechaAbordaje;

    @Column(name = "codigo_qr", length = 100)
    private String codigoQr;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "numero_asiento")
    private Short numeroAsiento;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

}