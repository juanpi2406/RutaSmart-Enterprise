package com.rutasmart.repository;

import com.rutasmart.entity.AsignacionProgramacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsignacionProgramacionRepository extends JpaRepository<AsignacionProgramacion, Long> {

}