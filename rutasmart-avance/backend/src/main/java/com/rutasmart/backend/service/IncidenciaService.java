package com.rutasmart.backend.service;

import com.rutasmart.backend.model.Incidencia;
import com.rutasmart.backend.repository.IncidenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidenciaService {

    private final IncidenciaRepository repository;

    public List<Incidencia> listar() {
        return repository.findAll();
    }

    public Incidencia crear(Incidencia i) {
        return repository.save(i);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
