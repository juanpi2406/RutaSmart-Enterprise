package com.rutasmart.controller;

import com.rutasmart.dto.NotificacionDTO;
import com.rutasmart.service.interfaces.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping
    public List<NotificacionDTO> listar() {
        return notificacionService.listar();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/recientes")
    public List<NotificacionDTO> recientes() {
        return notificacionService.listarRecientes();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/usuario/{idUsuario}")
    public List<NotificacionDTO> porUsuario(@PathVariable Long idUsuario) {
        return notificacionService.listarPorUsuario(idUsuario);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/usuario/{idUsuario}/no-leidas")
    public Map<String, Long> noLeidasUsuario(@PathVariable Long idUsuario) {
        return Map.of("total", notificacionService.contarNoLeidas(idUsuario));
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/no-leidas")
    public Map<String, Long> noLeidasGlobales() {
        return Map.of("total", notificacionService.contarNoLeidasGlobales());
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/{id}/leer")
    public NotificacionDTO marcarLeida(@PathVariable Long id) {
        return notificacionService.marcarLeida(id);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public NotificacionDTO buscar(@PathVariable Long id) {
        return notificacionService.buscarPorId(id);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NotificacionDTO guardar(@RequestBody NotificacionDTO dto) {
        return notificacionService.guardar(dto);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public NotificacionDTO actualizar(@PathVariable Long id,
                                      @RequestBody NotificacionDTO dto) {

        return notificacionService.actualizar(id, dto);

    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        notificacionService.eliminar(id);
    }

}
