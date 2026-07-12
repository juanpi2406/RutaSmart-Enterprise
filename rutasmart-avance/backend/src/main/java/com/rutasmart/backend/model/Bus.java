package com.rutasmart.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "buses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;   // BUS-01
    private String placa;    // ABC-123
    private String ruta;     // Ruta Norte
    private String chofer;   // Pedro León
    private String estado;   // DISPONIBLE | EN_RUTA | MANTENIMIENTO
}
