package com.rutasmart.controller;

import com.rutasmart.dto.AlumnoDTO;
import com.rutasmart.service.interfaces.AlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlumnoController {

    private final AlumnoService alumnoService;

    @GetMapping
    public List<AlumnoDTO> listar() {
        return alumnoService.listar();
    }

    @GetMapping("/{id}")
    public AlumnoDTO buscarPorId(@PathVariable Long id) {
        return alumnoService.buscarPorId(id);
    }

    @GetMapping("/usuario/{idUsuario}")
    public AlumnoDTO buscarPorUsuario(@PathVariable Long idUsuario) {
        return alumnoService.buscarPorUsuarioId(idUsuario);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlumnoDTO guardar(@RequestBody AlumnoDTO dto) {
        return alumnoService.guardar(dto);
    }

    @PutMapping("/{id}")
    public AlumnoDTO actualizar(@PathVariable Long id,
                                @RequestBody AlumnoDTO dto) {

        return alumnoService.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        alumnoService.eliminar(id);
    }

}