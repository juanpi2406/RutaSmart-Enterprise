package com.rutasmart.repository;

import com.rutasmart.entity.ProgramacionViaje;
import com.rutasmart.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ProgramacionViajeRepository extends JpaRepository<ProgramacionViaje, Long> {

    List<ProgramacionViaje> findByRuta(Ruta ruta);

    List<ProgramacionViaje> findByHoraSalida(LocalTime horaSalida);

    List<ProgramacionViaje> findByEstadoTrue();

}