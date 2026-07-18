package com.rutasmart.repository;

import com.rutasmart.entity.UbicacionBus;
import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UbicacionBusRepository extends JpaRepository<UbicacionBus, Long> {

    List<UbicacionBus> findByViajeOrderByFechaHoraDesc(Viaje viaje);

    Optional<UbicacionBus> findFirstByViaje_IdViajeOrderByFechaHoraDesc(Long idViaje);

    @Query("""
            SELECT u FROM UbicacionBus u
            WHERE u.viaje.estado IN ('EN_RUTA', 'EN_CURSO')
            AND u.fechaHora = (
                SELECT MAX(u2.fechaHora) FROM UbicacionBus u2
                WHERE u2.viaje = u.viaje
            )
            """)
    List<UbicacionBus> findUltimasDeViajesActivos();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM UbicacionBus u WHERE u.viaje.idViaje = :idViaje")
    void deleteAllByViajeId(@Param("idViaje") Long idViaje);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM UbicacionBus u WHERE u.viaje.programacion.idProgramacion = :idProgramacion")
    void deleteAllByProgramacionId(@Param("idProgramacion") Long idProgramacion);

}