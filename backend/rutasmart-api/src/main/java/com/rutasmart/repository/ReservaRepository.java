package com.rutasmart.repository;

import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Reserva;
import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findByAlumno(Alumno alumno);

    List<Reserva> findByViaje(Viaje viaje);

    List<Reserva> findByEstado(String estado);

    boolean existsByAlumnoAndViaje(Alumno alumno, Viaje viaje);

    List<Reserva> findByAlumno_IdAlumno(Long idAlumno);

    List<Reserva> findByViaje_IdViaje(Long idViaje);
    
  /*=========================================
 * DASHBOARD ALUMNO
 =========================================*/

Optional<Reserva> findFirstByAlumno_IdAlumnoOrderByIdReservaDesc(
        Long idAlumno
);

long countByAlumno_IdAlumno(Long idAlumno);

/*=========================================
 * RESERVAS
 =========================================*/

long countByViaje_IdViaje(Long idViaje);

}
