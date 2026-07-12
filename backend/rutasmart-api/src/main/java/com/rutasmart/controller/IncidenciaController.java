package com.rutasmart.controller;

import com.rutasmart.dto.IncidenciaDTO;
import com.rutasmart.service.interfaces.IncidenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<IncidenciaDTO> listar() {
        return incidenciaService.listar();
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @GetMapping("/{id}")
    public IncidenciaDTO buscar(@PathVariable Long id) {
        return incidenciaService.buscarPorId(id);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidenciaDTO guardar(@RequestBody IncidenciaDTO dto) {
        return incidenciaService.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public IncidenciaDTO actualizar(@PathVariable Long id,
                                    @RequestBody IncidenciaDTO dto) {

        return incidenciaService.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        incidenciaService.eliminar(id);
    }

}
