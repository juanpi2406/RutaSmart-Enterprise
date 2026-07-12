package com.rutasmart.repository;

import com.rutasmart.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Long> {

    Optional<Ruta> findByCodigo(String codigo);

    Optional<Ruta> findByNombre(String nombre);

    boolean existsByCodigo(String codigo);

}