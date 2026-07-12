package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
<<<<<<< HEAD
=======
import java.util.List;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

@Entity
@Table(name = "choferes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chofer {

    /*=========================================
     * PRIMARY KEY
     =========================================*/

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chofer")
    private Long idChofer;

    /*=========================================
     * RELACIÓN CON USUARIO
     =========================================*/

    @OneToOne(fetch = FetchType.LAZY)
<<<<<<< HEAD
    @JoinColumn(
    name = "id_usuario",
    nullable = false
        )       
=======
    @JoinColumn(name = "id_usuario", nullable = false)
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    private Usuario usuario;

    /*=========================================
     * INFORMACIÓN DEL CHOFER
     =========================================*/

<<<<<<< HEAD
@Column(name = "licencia", nullable = false, unique = true, length = 30)
private String numeroLicencia;

    @Column(name = "categoria_licencia", nullable = false, length = 10)
=======
    @Column(nullable = false, unique = true, length = 30)
    private String licencia;

    @Column(name = "categoria_licencia", length = 10)
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    private String categoriaLicencia;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

<<<<<<< HEAD


=======
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    /*=========================================
     * ESTADO
     =========================================*/

<<<<<<< HEAD
    @Column(nullable = false)
    @Builder.Default
=======
    @Builder.Default
    @Column(nullable = false)
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    private Boolean estado = true;

    /*=========================================
     * AUDITORÍA
     =========================================*/

<<<<<<< HEAD
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

=======
    @Column(name = "created_at",
            insertable = false,
            updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at",
            insertable = false)
    private LocalDateTime updatedAt;




    @OneToMany(mappedBy = "chofer",
        fetch = FetchType.LAZY)
private List<Viaje> viajes;

@OneToMany(mappedBy = "chofer",
        fetch = FetchType.LAZY)
private List<AsignacionProgramacion> asignaciones;

>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
}