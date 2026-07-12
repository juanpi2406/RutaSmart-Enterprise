package com.rutasmart.controller;

import com.rutasmart.dto.AsientoDTO;
import com.rutasmart.service.interfaces.AsientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asientos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AsientoController {

    private final AsientoService service;

    @GetMapping("/viaje/{idViaje}")
    public List<AsientoDTO> listarPorViaje(@PathVariable Long idViaje) {
        return service.listarPorViaje(idViaje);
    }

}
