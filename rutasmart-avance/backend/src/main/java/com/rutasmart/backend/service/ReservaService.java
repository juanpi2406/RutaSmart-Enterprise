package com.rutasmart.backend.service;

import com.rutasmart.backend.model.Reserva;
import com.rutasmart.backend.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository repository;

    public List<Reserva> listar() {
        return repository.findAll();
    }

    public Reserva obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada: " + id));
    }

    public Reserva crear(Reserva r) {
        return repository.save(r);
    }

    public Reserva actualizar(Long id, Reserva r) {
        Reserva existente = obtener(id);
        existente.setAlumno(r.getAlumno());
        existente.setRuta(r.getRuta());
        existente.setFecha(r.getFecha());
        existente.setHora(r.getHora());
        existente.setEstado(r.getEstado());
        return repository.save(existent);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
