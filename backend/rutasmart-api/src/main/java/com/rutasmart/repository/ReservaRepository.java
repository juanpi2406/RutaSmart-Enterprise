package com.rutasmart.repository;

import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByAlumno(Alumno alumno);

    List<Reserva> findByViaje(Viaje viaje);

    List<Reserva> findByEstado(String estado);

    boolean existsByAlumnoAndViaje(Alumno alumno, Viaje viaje);

    List<Reserva> findByAlumno_IdAlumno(Long idAlumno);

    List<Reserva> findByViaje_IdViaje(Long idViaje);

    Optional<Reserva> findFirstByAlumno_IdAlumnoOrderByIdReservaDesc(Long idAlumno);

    long countByAlumno_IdAlumno(Long idAlumno);

    long countByViaje_IdViaje(Long idViaje);

    List<Reserva> findByFechaReservaGreaterThanEqualOrderByFechaReservaAsc(LocalDateTime desde);

    List<Reserva> findTop5ByOrderByFechaReservaDesc();

    Optional<Reserva> findByCodigoQrAndViaje_IdViaje(String codigoQr, Long idViaje);

    List<Reserva> findByViaje_IdViajeAndEstadoNot(Long idViaje, String estado);

    long countByAlumno_IdAlumnoAndEstado(Long idAlumno, String estado);

    List<Reserva> findByAlumno_IdAlumnoAndEstadoOrderByViaje_FechaViajeDesc(Long idAlumno, String estado);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Reserva r WHERE r.viaje.idViaje = :idViaje")
    void deleteAllByViajeId(@Param("idViaje") Long idViaje);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Reserva r WHERE r.viaje.programacion.idProgramacion = :idProgramacion")
    void deleteAllByProgramacionId(@Param("idProgramacion") Long idProgramacion);

}
