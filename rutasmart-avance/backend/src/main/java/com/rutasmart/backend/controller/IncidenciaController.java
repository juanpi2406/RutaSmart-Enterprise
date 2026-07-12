package com.rutasmart.backend.controller;

import com.rutasmart.backend.model.Incidencia;
import com.rutasmart.backend.service.IncidenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class IncidenciaController {

    private final IncidenciaService service;

    @GetMapping
    public List<Incidencia> listar() {
        return service.listar();
    }

    @PostMapping
    public Incidencia crear(@RequestBody Incidencia i) {
        return service.crear(i);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
