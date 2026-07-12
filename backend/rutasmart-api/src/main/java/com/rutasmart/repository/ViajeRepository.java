package com.rutasmart.repository;

import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {

    List<Viaje> findByFechaViaje(LocalDate fechaViaje);

    List<Viaje> findByEstado(String estado);

    List<Viaje> findByProgramacion_Ruta_IdRutaAndFechaViaje(Long idRuta, LocalDate fechaViaje);

    List<Viaje> findByProgramacion_Ruta_IdRutaAndFechaViajeAndEstado(Long idRuta, LocalDate fechaViaje, String estado);

}