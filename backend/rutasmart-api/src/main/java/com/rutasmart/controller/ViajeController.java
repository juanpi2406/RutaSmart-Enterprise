package com.rutasmart.controller;

import com.rutasmart.dto.EstadoViajeDTO;
import com.rutasmart.dto.ViajeDTO;
import com.rutasmart.service.interfaces.ViajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viajes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ViajeController {

    private final ViajeService service;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<ViajeDTO> listar() {
        return service.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/chofer/{idChofer}")
    public List<ViajeDTO> listarPorChofer(@PathVariable Long idChofer) {
        return service.listarPorChofer(idChofer);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/buscar")
    public List<ViajeDTO> buscarPorRutaYFecha(
            @RequestParam Long ruta,
            @RequestParam String fechaViaje) {
        return service.listarPorRutaYFecha(ruta, fechaViaje);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ViajeDTO buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ViajeDTO guardar(@RequestBody ViajeDTO dto) {
        return service.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ViajeDTO actualizar(@PathVariable Long id,
                               @RequestBody ViajeDTO dto) {
        return service.actualizar(id, dto);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER')")
    @PatchMapping("/{id}/estado")
    public ViajeDTO actualizarEstado(@PathVariable Long id,
                                     @RequestBody EstadoViajeDTO dto) {
        return service.actualizarEstado(id, dto.getEstado());
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/historial")
    public List<ViajeDTO> historial() {
        return service.listarHistorial();
    }

}
