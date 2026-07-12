package com.rutasmart.repository;

import com.rutasmart.entity.UbicacionBus;
import com.rutasmart.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbicacionBusRepository extends JpaRepository<UbicacionBus, Long> {

    List<UbicacionBus> findByViajeOrderByFechaHoraDesc(Viaje viaje);

}