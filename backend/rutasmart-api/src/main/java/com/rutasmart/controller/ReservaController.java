package com.rutasmart.controller;

import com.rutasmart.dto.ReservaDTO;
import com.rutasmart.service.interfaces.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;

    @GetMapping
    public List<ReservaDTO> listar() {
        return reservaService.listar();
    }

    @GetMapping("/alumno/{idAlumno}")
    public List<ReservaDTO> listarPorAlumno(@PathVariable Long idAlumno) {
        return reservaService.listarPorAlumno(idAlumno);
    }

    @GetMapping("/viaje/{idViaje}")
    public List<ReservaDTO> listarPorViaje(@PathVariable Long idViaje) {
        return reservaService.listarPorViaje(idViaje);
    }

    @GetMapping("/{id}")
    public ReservaDTO buscarPorId(@PathVariable Long id) {
        return reservaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservaDTO guardar(@RequestBody ReservaDTO dto) {
        return reservaService.guardar(dto);
    }

    @PutMapping("/{id}")
    public ReservaDTO actualizar(@PathVariable Long id,
                                 @RequestBody ReservaDTO dto) {

        return reservaService.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        reservaService.eliminar(id);
    }

}
