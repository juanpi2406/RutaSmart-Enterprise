package com.rutasmart.repository;

import com.rutasmart.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCodigo(String codigo);

    Optional<Usuario> findByCorreo(String correo);

    List<Usuario> findByEstadoTrue();

    boolean existsByCodigo(String codigo);

    boolean existsByCorreo(String correo);

}