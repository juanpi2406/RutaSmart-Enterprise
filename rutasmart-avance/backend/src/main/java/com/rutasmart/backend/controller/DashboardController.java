package com.rutasmart.backend.controller;

import com.rutasmart.backend.service.ReporteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final ReporteService service;

    @GetMapping("/kpis")
    public Map<String, Object> kpis() {
        Map<String, Object> resumen = service.resumen();
        Map<String, Object> kpis = new LinkedHashMap<>();
        kpis.put("alumnos", resumen.get("totalUsuarios"));
        kpis.put("buses", resumen.get("totalBuses"));
        kpis.put("reservas", resumen.get("totalReservas"));
        kpis.put("incidencias", resumen.get("totalIncidencias"));
        kpis.put("reservasPorRuta", resumen.get("reservasPorRuta"));
        kpis.put("flota", resumen.get("flota"));
        return kpis;
    }
}
