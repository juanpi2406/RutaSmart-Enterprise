package com.rutasmart.controller;

import com.rutasmart.dto.UbicacionBusDTO;
import com.rutasmart.service.interfaces.UbicacionBusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ubicaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UbicacionBusController {

    private final UbicacionBusService ubicacionBusService;

    @GetMapping
    public List<UbicacionBusDTO> listar() {
        return ubicacionBusService.listar();
    }

    @GetMapping("/{id}")
    public UbicacionBusDTO buscarPorId(@PathVariable Long id) {
        return ubicacionBusService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UbicacionBusDTO guardar(
            @RequestBody UbicacionBusDTO dto) {

        return ubicacionBusService.guardar(dto);

    }

    @PutMapping("/{id}")
    public UbicacionBusDTO actualizar(
            @PathVariable Long id,
            @RequestBody UbicacionBusDTO dto) {

        return ubicacionBusService.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {

        ubicacionBusService.eliminar(id);

    }

}