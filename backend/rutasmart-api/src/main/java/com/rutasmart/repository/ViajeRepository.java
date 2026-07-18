package com.rutasmart.repository;

import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<Viaje> findByChofer_IdChoferOrderByFechaViajeDesc(Long idChofer);

    long countByEstado(String estado);

    List<Viaje> findByEstadoIn(List<String> estados);

    List<Viaje> findByProgramacion_IdProgramacion(Long idProgramacion);

    long countByBus_IdBus(Long idBus);

    long countByChofer_IdChofer(Long idChofer);

    boolean existsByProgramacion_IdProgramacionAndFechaViaje(Long idProgramacion, LocalDate fechaViaje);

    List<Viaje> findByChofer_IdChoferAndFechaViajeOrderByProgramacion_HoraSalidaAsc(
            Long idChofer, LocalDate fechaViaje);

    long countByChofer_IdChoferAndFechaViajeAndEstadoIn(
            Long idChofer, LocalDate fechaViaje, List<String> estados);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Viaje v WHERE v.programacion.idProgramacion = :idProgramacion")
    void deleteAllByProgramacionId(@Param("idProgramacion") Long idProgramacion);

}