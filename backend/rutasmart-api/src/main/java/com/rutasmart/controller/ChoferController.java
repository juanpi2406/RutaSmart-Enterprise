package com.rutasmart.controller;

<<<<<<< HEAD
import com.rutasmart.dto.request.ChoferCreateDTO;
import com.rutasmart.dto.request.ChoferUpdateDTO;
import com.rutasmart.dto.response.ChoferResponseDTO;
import com.rutasmart.exception.ApiResponse;
import com.rutasmart.service.interfaces.ChoferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/choferes")
@RequiredArgsConstructor
@Tag(name = "Choferes", description = "API para la gestión de choferes")

=======
import com.rutasmart.dto.ChoferDTO;
import com.rutasmart.service.interfaces.ChoferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/choferes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
public class ChoferController {

    private final ChoferService choferService;

<<<<<<< HEAD
    /**
     * Listar todos los choferes
     */
    @GetMapping
    @Operation(summary = "Listar todos los choferes")
    public ResponseEntity<ApiResponse<List<ChoferResponseDTO>>> listar() {

        List<ChoferResponseDTO> data = choferService.listar();

        return ResponseEntity.ok(
                ApiResponse.success(
                        data,
                        "Lista de choferes obtenida correctamente."
                )
        );

    }

    /**
     * Buscar chofer por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener chofer por ID")
    public ResponseEntity<ApiResponse<ChoferResponseDTO>> obtenerPorId(
            @PathVariable Long id) {

        ChoferResponseDTO data = choferService.obtenerPorId(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        data,
                        "Chofer encontrado."
                )
        );

    }

    /**
     * Registrar nuevo chofer
     */
    @PostMapping
    @Operation(summary = "Registrar un nuevo chofer")
    public ResponseEntity<ApiResponse<ChoferResponseDTO>> crear(
            @Valid @RequestBody ChoferCreateDTO dto) {

        ChoferResponseDTO data = choferService.crear(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                data,
                                "Chofer registrado correctamente."
                        )
                );

    }

    /**
     * Actualizar chofer
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un chofer")
    public ResponseEntity<ApiResponse<ChoferResponseDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ChoferUpdateDTO dto) {

        ChoferResponseDTO data = choferService.actualizar(id, dto);

        return ResponseEntity.ok(
                ApiResponse.success(
                        data,
                        "Chofer actualizado correctamente."
                )
        );

    }

    /**
     * Eliminar chofer
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un chofer")
    public ResponseEntity<ApiResponse<Object>> eliminar(
            @PathVariable Long id) {

        choferService.eliminar(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        null,
                        "Chofer eliminado correctamente."
                )
        );

=======
    @GetMapping
    public List<ChoferDTO> listar() {
        return choferService.listar();
    }

    @GetMapping("/{id}")
    public ChoferDTO buscarPorId(@PathVariable Long id) {
        return choferService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChoferDTO guardar(@RequestBody ChoferDTO dto) {
        return choferService.guardar(dto);
    }

    @PutMapping("/{id}")
    public ChoferDTO actualizar(@PathVariable Long id,
                                @RequestBody ChoferDTO dto) {

        return choferService.actualizar(id, dto);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        choferService.eliminar(id);
>>>>>>> dcdb45b (feat(alumno): implementar a Angular)
    }

}