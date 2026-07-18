package com.rutasmart.controller;

import com.rutasmart.dto.RutaDTO;
import com.rutasmart.dto.RutaGeometriaDTO;
import com.rutasmart.dto.LimpiezaSinGpsDTO;
import com.rutasmart.service.LimpiarSinGpsService;
import com.rutasmart.service.interfaces.RutaGeometriaService;
import com.rutasmart.service.interfaces.RutaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RutaController {

    private final RutaService rutaService;
    private final RutaGeometriaService rutaGeometriaService;
    private final LimpiarSinGpsService limpiarSinGpsService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<RutaDTO> listar() {
        return rutaService.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public RutaDTO buscarPorId(@PathVariable Long id) {
        return rutaService.buscarPorId(id);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}/geometria")
    public RutaGeometriaDTO geometria(@PathVariable Long id) {
        return rutaGeometriaService.obtenerGeometria(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RutaDTO guardar(@RequestBody RutaDTO dto) {
        return rutaService.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public RutaDTO actualizar(@PathVariable Long id,
                              @RequestBody RutaDTO dto) {

        return rutaService.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        rutaService.eliminar(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("/limpiar-sin-gps")
    public LimpiezaSinGpsDTO limpiarSinGps() {
        return limpiarSinGpsService.limpiar();
    }

}
