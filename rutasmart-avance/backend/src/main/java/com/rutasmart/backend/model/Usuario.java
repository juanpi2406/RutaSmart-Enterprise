package com.rutasmart.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String correo;

    @JsonIgnore
    private String password;

    private String rol;     // ADMINISTRADOR | ALUMNO | CHOFER
    private String estado;  // ACTIVO | VACACIONES | INACTIVO

    private String dni;
    private String licencia;
    private String vencimiento;
    private String telefono;
}
