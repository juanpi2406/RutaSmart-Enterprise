package com.rutasmart.controller;

import com.rutasmart.dto.NotificacionDTO;
import com.rutasmart.service.interfaces.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
