package com.rutasmart.controller;

import com.rutasmart.dto.AsientoDTO;
import com.rutasmart.service.interfaces.AsientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asientos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AsientoController {

    private final AsientoService service;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/viaje/{idViaje}")
    public List<AsientoDTO> listarPorViaje(@PathVariable Long idViaje) {
        return service.listarPorViaje(idViaje);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AsientoDTO guardar(@RequestBody AsientoDTO dto) {
        return service.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public AsientoDTO actualizar(@PathVariable Long id,
                                  @RequestBody AsientoDTO dto) {

        return service.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
