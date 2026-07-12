package com.rutasmart.controller;

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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/choferes")
@RequiredArgsConstructor
@Tag(name = "Choferes", description = "API para la gestión de choferes")
public class ChoferController {

    private final ChoferService choferService;

    /**
     * Listar todos los choferes
     */
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    @PreAuthorize("isAuthenticated()")
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
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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
    @PreAuthorize("hasRole('ADMINISTRADOR')")
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

    }

}
