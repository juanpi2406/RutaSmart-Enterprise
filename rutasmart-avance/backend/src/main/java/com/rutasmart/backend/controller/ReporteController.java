package com.rutasmart.backend.controller;

import com.rutasmart.backend.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReporteController {

    private final ReporteService service;

    @GetMapping("/resumen")
    public Map<String, Object> resumen() {
        return service.resumen();
    }
}
