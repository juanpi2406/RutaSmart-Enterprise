package com.rutasmart.backend.controller;

import com.rutasmart.backend.model.Bus;
import com.rutasmart.backend.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BusController {

    private final BusService service;

    @GetMapping
    public List<Bus> listar() {
        return service.listar();
    }

    @PostMapping
    public Bus crear(@RequestBody Bus b) {
        return service.crear(b);
    }

    @PutMapping("/{id}")
    public Bus actualizar(@PathVariable Long id, @RequestBody Bus b) {
        return service.actualizar(id, b);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
