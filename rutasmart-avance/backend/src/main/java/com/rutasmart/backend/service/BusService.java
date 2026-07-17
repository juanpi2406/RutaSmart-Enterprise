package com.rutasmart.backend.service;

import com.rutasmart.backend.model.Bus;
import com.rutasmart.backend.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository repository;

    public List<Bus> listar() {
        return repository.findAll();
    }

    public Bus obtener(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus no encontrado: " + id));
    }

    public Bus crear(Bus b) {
        return repository.save(b);
    }

    public Bus actualizar(Long id, Bus b) {
        Bus existente = obtener(id);
        existente.setCodigo(b.getCodigo());
        existente.setPlaca(b.getPlaca());
        existente.setRuta(b.getRuta());
        existente.setChofer(b.getChofer());
        existente.setEstado(b.getEstado());
        return repository.save(existente);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
