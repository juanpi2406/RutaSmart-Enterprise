package com.rutasmart.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String alumno;  // Carlos Ruiz
    private String ruta;    // Norte | Sur | Centro
    private String fecha;   // YYYY-MM-DD
    private String hora;    // HH:mm
    private String estado;  // CONFIRMADA | PENDIENTE | CANCELADA
}
