package com.rutasmart.repository;

import com.rutasmart.entity.Notificacion;
import com.rutasmart.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByUsuario(Usuario usuario);

    List<Notificacion> findByLeido(Boolean leido);

    List<Notificacion> findByUsuarioAndLeido(Usuario usuario, Boolean leido);

    List<Notificacion> findByUsuario_IdUsuarioOrderByFechaEnvioDesc(Long idUsuario);

    long countByUsuario_IdUsuarioAndLeido(Long idUsuario, Boolean leido);

    List<Notificacion> findTop10ByOrderByFechaEnvioDesc();

    long countByLeido(Boolean leido);

}