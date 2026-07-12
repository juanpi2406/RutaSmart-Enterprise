package com.rutasmart.controller;

import com.rutasmart.dto.ProgramacionViajeDTO;
import com.rutasmart.service.interfaces.ProgramacionViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProgramacionViajeController {

    private final ProgramacionViajeService service;

    @GetMapping
    public List<ProgramacionViajeDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ProgramacionViajeDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProgramacionViajeDTO guardar(@RequestBody ProgramacionViajeDTO dto) {
        return service.guardar(dto);
    }

    @PutMapping("/{id}")
    public ProgramacionViajeDTO actualizar(@PathVariable Long id,
                                           @RequestBody ProgramacionViajeDTO dto) {

        return service.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}