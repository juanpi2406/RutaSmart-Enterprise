package com.rutasmart.repository;

import com.rutasmart.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    Optional<Bus> findByCodigo(String codigo);

    Optional<Bus> findByPlaca(String placa);

    boolean existsByCodigo(String codigo);

    boolean existsByPlaca(String placa);

}