package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "asientos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asiento")
    private Long idAsiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_viaje", nullable = false)
    private Viaje viaje;

    @Column(name = "numero_asiento", nullable = false)
    private Short numeroAsiento;

    @Column(nullable = false)
    private Boolean estado;

    @Column(name = "created_at", insertable = false, updatable = false)
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private java.time.LocalDateTime updatedAt;

}
