package com.rutasmart.repository;

import com.rutasmart.entity.Alumno;
import com.rutasmart.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Long> {

    Optional<Alumno> findByCodigoUniversitario(String codigoUniversitario);

    Optional<Alumno> findByUsuario(Usuario usuario);

    boolean existsByCodigoUniversitario(String codigoUniversitario);

    Optional<Alumno> findByUsuario_IdUsuario(Long idUsuario);

}