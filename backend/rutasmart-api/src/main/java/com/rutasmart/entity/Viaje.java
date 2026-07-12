package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;

@Entity
@Table(name = "viajes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viaje")
    private Long idViaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_programacion", nullable = false)
    private ProgramacionViaje programacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_bus", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chofer", nullable = false)
    private Chofer chofer;

    @Column(name = "fecha_viaje", nullable = false)
    private LocalDate fechaViaje;

    @Column(name = "hora_inicio_real")
    private LocalDateTime horaInicioReal;

    @Column(name = "hora_fin_real")
    private LocalDateTime horaFinReal;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;



    @OneToMany(mappedBy = "viaje",
        fetch = FetchType.LAZY)
private List<Reserva> reservas;

@OneToMany(mappedBy = "viaje",
        fetch = FetchType.LAZY)
private List<UbicacionBus> ubicaciones;

@OneToMany(mappedBy = "viaje",
        fetch = FetchType.LAZY)
private List<Incidencia> incidencias;

}