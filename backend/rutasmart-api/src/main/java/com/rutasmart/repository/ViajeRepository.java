package com.rutasmart.repository;

import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {

    List<Viaje> findByFechaViaje(LocalDate fechaViaje);

    List<Viaje> findByEstado(String estado);

    List<Viaje> findByProgramacion_Ruta_IdRutaAndFechaViaje(
            Long idRuta,
            LocalDate fechaViaje
    );

    List<Viaje> findByProgramacion_Ruta_IdRutaAndFechaViajeAndEstado(
            Long idRuta,
            LocalDate fechaViaje,
            String estado
    );

    /*=========================================
     * DASHBOARD CHOFER
     =========================================*/

    Optional<Viaje> findFirstByChofer_IdChoferAndEstado(
            Long idChofer,
            String estado
    );

    Optional<Viaje> findFirstByChofer_IdChoferOrderByFechaViajeDesc(
            Long idChofer
    );
    long countByEstado(String estado);

}