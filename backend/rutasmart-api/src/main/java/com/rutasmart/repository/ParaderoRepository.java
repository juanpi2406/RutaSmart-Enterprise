package com.rutasmart.repository;

import com.rutasmart.entity.Paradero;
import com.rutasmart.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParaderoRepository extends JpaRepository<Paradero, Long> {

    List<Paradero> findByRutaOrderByOrdenAsc(Ruta ruta);

    List<Paradero> findByEstadoTrue();

}