package com.rutasmart.backend.service;

import com.rutasmart.backend.model.Usuario;
import com.rutasmart.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
    }

    public Usuario crear(Usuario u) {
        return repository.save(u);
    }

    public Usuario actualizar(Long id, Usuario u) {
        Usuario existente = obtener(id);
        existente.setNombre(u.getNombre());
        existente.setCorreo(u.getCorreo());
        existente.setRol(u.getRol());
        existente.setEstado(u.getEstado());
        existente.setDni(u.getDni());
        existente.setLicencia(u.getLicencia());
        existente.setVencimiento(u.getVencimiento());
        existente.setTelefono(u.getTelefono());
        if (u.getPassword() != null && !u.getPassword().isBlank()) {
            existente.setPassword(u.getPassword());
        }
        return repository.save(existent);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
