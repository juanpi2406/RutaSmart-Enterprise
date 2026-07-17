package com.rutasmart.repository;
import com.rutasmart.entity.Usuario;
import com.rutasmart.entity.Chofer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface ChoferRepository extends JpaRepository<Chofer, Long> {

    Optional<Chofer> findByNumeroLicencia(String numeroLicencia);

    Optional<Chofer> findByUsuario(Usuario usuario);

    Optional<Chofer> findByUsuario_IdUsuario(Long idUsuario);       

    boolean existsByNumeroLicencia(String numeroLicencia);

    boolean existsByUsuario_IdUsuario(Long idUsuario);

}
