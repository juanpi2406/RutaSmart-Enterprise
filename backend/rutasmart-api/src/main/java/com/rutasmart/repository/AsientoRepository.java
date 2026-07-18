package com.rutasmart.repository;

import com.rutasmart.entity.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsientoRepository extends JpaRepository<Asiento, Long> {

    List<Asiento> findByViaje_IdViaje(Long idViaje);

    Optional<Asiento> findByViaje_IdViajeAndNumeroAsiento(Long idViaje, Short numeroAsiento);

    List<Asiento> findByViaje_IdViajeAndEstado(Long idViaje, Boolean estado);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Asiento a WHERE a.viaje.idViaje = :idViaje")
    void deleteAllByViajeId(@Param("idViaje") Long idViaje);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Asiento a WHERE a.viaje.programacion.idProgramacion = :idProgramacion")
    void deleteAllByProgramacionId(@Param("idProgramacion") Long idProgramacion);

}
