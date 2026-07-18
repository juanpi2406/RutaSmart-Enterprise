package com.rutasmart.controller;

import com.rutasmart.dto.UbicacionBusDTO;
import com.rutasmart.service.interfaces.UbicacionBusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ubicaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UbicacionBusController {

    private final UbicacionBusService ubicacionBusService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<UbicacionBusDTO> listar() {
        return ubicacionBusService.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/activas")
    public List<UbicacionBusDTO> listarActivas() {
        return ubicacionBusService.listarActivas();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/viaje/{idViaje}/ultima")
    public UbicacionBusDTO ultimaPorViaje(@PathVariable Long idViaje) {
        return ubicacionBusService.ultimaPorViaje(idViaje);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public UbicacionBusDTO buscarPorId(@PathVariable Long id) {
        return ubicacionBusService.buscarPorId(id);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UbicacionBusDTO guardar(
            @RequestBody UbicacionBusDTO dto) {

        return ubicacionBusService.guardar(dto);

    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @PutMapping("/{id}")
    public UbicacionBusDTO actualizar(
            @PathVariable Long id,
            @RequestBody UbicacionBusDTO dto) {

        return ubicacionBusService.actualizar(id, dto);

    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {

        ubicacionBusService.eliminar(id);

    }

}
