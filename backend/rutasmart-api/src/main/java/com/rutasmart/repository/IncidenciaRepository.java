package com.rutasmart.repository;

import com.rutasmart.entity.Incidencia;
import com.rutasmart.entity.Usuario;
import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    List<Incidencia> findByUsuario(Usuario usuario);

    List<Incidencia> findByUsuario_IdUsuarioOrderByFechaRegistroDesc(Long idUsuario);

    List<Incidencia> findByViaje(Viaje viaje);

    List<Incidencia> findByEstado(String estado);
    long countByEstado(String estado);

    List<Incidencia> findTop5ByOrderByFechaRegistroDesc();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Incidencia i WHERE i.viaje.idViaje = :idViaje")
    void deleteAllByViajeId(@Param("idViaje") Long idViaje);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Incidencia i WHERE i.viaje.programacion.idProgramacion = :idProgramacion")
    void deleteAllByProgramacionId(@Param("idProgramacion") Long idProgramacion);

}