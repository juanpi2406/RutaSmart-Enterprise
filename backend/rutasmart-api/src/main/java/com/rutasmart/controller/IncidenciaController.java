package com.rutasmart.controller;

import com.rutasmart.dto.IncidenciaDTO;
import com.rutasmart.security.JwtService;
import com.rutasmart.service.interfaces.IncidenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidenciaController {

    private static final String BEARER_PREFIX = "Bearer ";

    private final IncidenciaService incidenciaService;
    private final JwtService jwtService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<IncidenciaDTO> listar() {
        return incidenciaService.listar();
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER', 'ALUMNO')")
    @GetMapping("/usuario/{idUsuario}")
    public List<IncidenciaDTO> listarPorUsuario(@PathVariable Long idUsuario) {
        return incidenciaService.listarPorUsuario(idUsuario);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER', 'ALUMNO')")
    @GetMapping("/{id}")
    public IncidenciaDTO buscar(@PathVariable Long id) {
        return incidenciaService.buscarPorId(id);
    }

    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'CHOFER', 'ALUMNO')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncidenciaDTO guardar(@RequestBody IncidenciaDTO dto,
                                 @RequestHeader(value = "Authorization", required = false) String auth) {
        if ((dto.getIdUsuario() == null || dto.getIdUsuario() <= 0) && auth != null && auth.startsWith(BEARER_PREFIX)) {
            String token = auth.substring(BEARER_PREFIX.length());
            if (jwtService.esTokenValido(token)) {
                dto.setIdUsuario(jwtService.extraerIdUsuario(token));
            }
        }
        return incidenciaService.guardar(dto);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public IncidenciaDTO actualizar(@PathVariable Long id,
                                    @RequestBody IncidenciaDTO dto) {

        return incidenciaService.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        incidenciaService.eliminar(id);
    }

}
