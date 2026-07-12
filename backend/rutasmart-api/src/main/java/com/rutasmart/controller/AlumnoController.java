package com.rutasmart.controller;

import com.rutasmart.dto.AlumnoDTO;
import com.rutasmart.service.interfaces.AlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlumnoController {

    private final AlumnoService alumnoService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<AlumnoDTO> listar() {
        return alumnoService.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public AlumnoDTO buscarPorId(@PathVariable Long id) {
        return alumnoService.buscarPorId(id);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/usuario/{idUsuario}")
    public AlumnoDTO buscarPorUsuario(@PathVariable Long idUsuario) {
        return alumnoService.buscarPorUsuarioId(idUsuario);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlumnoDTO guardar(@RequestBody AlumnoDTO dto) {
        return alumnoService.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public AlumnoDTO actualizar(@PathVariable Long id,
                                @RequestBody AlumnoDTO dto) {

        return alumnoService.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        alumnoService.eliminar(id);
    }

}
