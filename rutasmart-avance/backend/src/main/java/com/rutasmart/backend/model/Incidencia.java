package com.rutasmart.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "incidencias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;        // Conductor | Bus | Ruta
    private String descripcion;
    private String fecha;       // YYYY-MM-DD
    private String estado;      // Activa | En revision | Resuelta
    private String reportadoPor;
}
