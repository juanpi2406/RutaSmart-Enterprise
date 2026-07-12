package com.rutasmart.controller;

import com.rutasmart.dto.AsignacionProgramacionDTO;
import com.rutasmart.service.interfaces.AsignacionProgramacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AsignacionProgramacionController {

    private final AsignacionProgramacionService service;

    @GetMapping
    public List<AsignacionProgramacionDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public AsignacionProgramacionDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AsignacionProgramacionDTO guardar(@RequestBody AsignacionProgramacionDTO dto) {
        return service.guardar(dto);
    }

    @PutMapping("/{id}")
    public AsignacionProgramacionDTO actualizar(@PathVariable Long id,
                                                @RequestBody AsignacionProgramacionDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}