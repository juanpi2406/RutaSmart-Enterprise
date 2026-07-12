package com.rutasmart.backend.repository;

import com.rutasmart.backend.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {
}
