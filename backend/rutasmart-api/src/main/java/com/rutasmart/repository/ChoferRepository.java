package com.rutasmart.repository;

import com.rutasmart.entity.Chofer;
<<<<<<< HEAD
=======
import com.rutasmart.entity.Usuario;
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChoferRepository extends JpaRepository<Chofer, Long> {

<<<<<<< HEAD
    Optional<Chofer> findByNumeroLicencia(String numeroLicencia);
    Optional<Chofer> findByUsuario_IdUsuario(Long idUsuario);

    boolean existsByNumeroLicencia(String numeroLicencia);

    boolean existsByUsuario_IdUsuario(Long idUsuario);
=======
    Optional<Chofer> findByLicencia(String licencia);

    Optional<Chofer> findByUsuario(Usuario usuario);

    boolean existsByLicencia(String licencia);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)

}