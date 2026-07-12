package com.rutasmart.controller;

import com.rutasmart.dto.RutaDTO;
import com.rutasmart.service.interfaces.RutaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RutaController {

    private final RutaService rutaService;

    @GetMapping
    public List<RutaDTO> listar() {
        return rutaService.listar();
    }

    @GetMapping("/{id}")
    public RutaDTO buscarPorId(@PathVariable Long id) {
        return rutaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RutaDTO guardar(@RequestBody RutaDTO dto) {
        return rutaService.guardar(dto);
    }

    @PutMapping("/{id}")
    public RutaDTO actualizar(@PathVariable Long id,
                              @RequestBody RutaDTO dto) {

        return rutaService.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        rutaService.eliminar(id);
    }

}