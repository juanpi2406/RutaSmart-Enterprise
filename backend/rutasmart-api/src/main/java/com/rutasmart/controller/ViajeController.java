package com.rutasmart.controller;

import com.rutasmart.dto.ViajeDTO;
import com.rutasmart.service.interfaces.ViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viajes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ViajeController {

    private final ViajeService service;

    @GetMapping
    public List<ViajeDTO> listar() {
        return service.listar();
    }

    @GetMapping("/buscar")
    public List<ViajeDTO> buscarPorRutaYFecha(
            @RequestParam Long ruta,
            @RequestParam String fechaViaje) {
        return service.listarPorRutaYFecha(ruta, fechaViaje);
    }

    @GetMapping("/{id}")
    public ViajeDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ViajeDTO guardar(@RequestBody ViajeDTO dto) {
        return service.guardar(dto);
    }

    @PutMapping("/{id}")
    public ViajeDTO actualizar(@PathVariable Long id,
                               @RequestBody ViajeDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
