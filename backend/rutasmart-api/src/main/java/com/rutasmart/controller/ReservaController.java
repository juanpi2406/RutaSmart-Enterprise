package com.rutasmart.controller;

import com.rutasmart.dto.CapacidadViajeDTO;
import com.rutasmart.dto.ReservaDTO;
import com.rutasmart.dto.ValidacionQrDTO;
import com.rutasmart.service.interfaces.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<ReservaDTO> listar() {
        return reservaService.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/alumno/{idAlumno}")
    public List<ReservaDTO> listarPorAlumno(@PathVariable Long idAlumno) {
        return reservaService.listarPorAlumno(idAlumno);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/viaje/{idViaje}")
    public List<ReservaDTO> listarPorViaje(@PathVariable Long idViaje) {
        return reservaService.listarPorViaje(idViaje);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ReservaDTO buscarPorId(@PathVariable Long id) {
        return reservaService.buscarPorId(id);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaDTO guardar(@RequestBody ReservaDTO dto) {
        return reservaService.guardar(dto);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ReservaDTO actualizar(@PathVariable Long id,
                                 @RequestBody ReservaDTO dto) {

        return reservaService.actualizar(id, dto);

    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        reservaService.eliminar(id);
    }

    @PreAuthorize("hasAnyRole('CHOFER', 'ADMINISTRADOR')")
    @PostMapping("/validar-qr")
    public ValidacionQrDTO validarQr(
            @RequestParam String codigo,
            @RequestParam Long idViaje) {
        return reservaService.validarQr(codigo, idViaje);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/viaje/{idViaje}/capacidad")
    public CapacidadViajeDTO capacidad(@PathVariable Long idViaje) {
        return reservaService.obtenerCapacidad(idViaje);
    }

}
