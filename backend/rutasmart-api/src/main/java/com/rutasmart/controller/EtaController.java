package com.rutasmart.controller;

import com.rutasmart.dto.EtaDTO;
import com.rutasmart.service.interfaces.EtaService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eta")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EtaController {

    private final EtaService etaService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/viaje/{idViaje}/paradero/{idParadero}")
    public EtaDTO calcular(
            @PathVariable Long idViaje,
            @PathVariable Long idParadero) {
        return etaService.calcularEta(idViaje, idParadero);
    }
}
