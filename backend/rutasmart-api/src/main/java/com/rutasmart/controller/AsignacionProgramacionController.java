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
public class AsignacionProgramacionController {

    private final AsignacionProgramacionService service;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<AsignacionProgramacionDTO> listar() {
        return service.listar();
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @GetMapping("/chofer/{idChofer}")
    public List<AsignacionProgramacionDTO> listarPorChofer(@PathVariable Long idChofer) {
        return service.listarPorChofer(idChofer);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/{id}")
    public AsignacionProgramacionDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AsignacionProgramacionDTO guardar(@RequestBody AsignacionProgramacionDTO dto) {
        return service.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public AsignacionProgramacionDTO actualizar(@PathVariable Long id,
                                                @RequestBody AsignacionProgramacionDTO dto) {
        return service.actualizar(id, dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
