package com.rutasmart.controller;

import com.rutasmart.dto.ParaderoDTO;
import com.rutasmart.service.interfaces.ParaderoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paraderos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParaderoController {

    private final ParaderoService service;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<ParaderoDTO> listar() {
        return service.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/ruta/{idRuta}")
    public List<ParaderoDTO> listarPorRuta(@PathVariable Long idRuta) {
        return service.listarPorRuta(idRuta);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ParaderoDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ParaderoDTO guardar(@RequestBody ParaderoDTO dto) {
        return service.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ParaderoDTO actualizar(@PathVariable Long id,
                                  @RequestBody ParaderoDTO dto) {

        return service.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
