package com.rutasmart.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    @JoinColumn(
    name = "id_usuario",
    nullable = false
        )       
    private Usuario usuario;

    /*=========================================
     * INFORMACIÓN DEL CHOFER
     =========================================*/

@Column(name = "licencia", nullable = false, unique = true, length = 30)
private String numeroLicencia;

    @Column(name = "categoria_licencia", nullable = false, length = 10)
    private String categoriaLicencia;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;



    /*=========================================
     * ESTADO
     =========================================*/

    @Column(nullable = false)
    @Builder.Default
    private Boolean estado = true;

    /*=========================================
     * AUDITORÍA
     =========================================*/

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;

}