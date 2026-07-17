package com.rutasmart.repository;

import com.rutasmart.entity.Incidencia;
import com.rutasmart.entity.Usuario;
import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    List<Incidencia> findByUsuario(Usuario usuario);

    List<Incidencia> findByViaje(Viaje viaje);

    List<Incidencia> findByEstado(String estado);
    long countByEstado(String estado);

}