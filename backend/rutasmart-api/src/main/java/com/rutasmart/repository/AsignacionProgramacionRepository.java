package com.rutasmart.repository;

import com.rutasmart.entity.AsignacionProgramacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionProgramacionRepository extends JpaRepository<AsignacionProgramacion, Long> {

    List<AsignacionProgramacion> findByChofer_IdChofer(Long idChofer);

    List<AsignacionProgramacion> findByProgramacion_IdProgramacion(Long idProgramacion);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM AsignacionProgramacion a WHERE a.programacion.idProgramacion = :idProgramacion")
    void deleteAllByProgramacionId(@Param("idProgramacion") Long idProgramacion);

}