package com.rutasmart.controller;

import com.rutasmart.dto.BusDTO;
import com.rutasmart.service.interfaces.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BusController {

    private final BusService busService;

    @GetMapping
    public List<BusDTO> listar() {
        return busService.listar();
    }

    @GetMapping("/{id}")
    public BusDTO buscarPorId(@PathVariable Long id) {
        return busService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BusDTO guardar(@RequestBody BusDTO dto) {
        return busService.guardar(dto);
    }

    @PutMapping("/{id}")
    public BusDTO actualizar(@PathVariable Long id,
                             @RequestBody BusDTO dto) {

        return busService.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        busService.eliminar(id);
    }

}