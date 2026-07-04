package com.rutasmart.repository;

import com.rutasmart.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCodigo(String codigo);

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCodigo(String codigo);

    boolean existsByCorreo(String correo);

}