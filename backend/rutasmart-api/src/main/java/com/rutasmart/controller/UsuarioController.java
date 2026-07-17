package com.rutasmart.controller;

import com.rutasmart.dto.UsuarioCreateDTO;
import com.rutasmart.dto.UsuarioResponseDTO;
import com.rutasmart.dto.UsuarioUpdateDTO;
import com.rutasmart.exception.ApiResponse;
import com.rutasmart.service.interfaces.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
//@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {

    private final UsuarioService service;

    /**
     * Listar todos los usuarios
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioResponseDTO>>> listar() {

        return ResponseEntity.ok(
                ApiResponse.success(
                        service.listar(),
                        "Listado de usuarios obtenido correctamente."
                )
        );

    }

    /**
     * Buscar usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> buscar(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        service.buscarPorId(id),
                        "Usuario encontrado."
                )
        );

    }

    /**
     * Registrar usuario
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> guardar(
            @Valid @RequestBody UsuarioCreateDTO dto) {

        UsuarioResponseDTO usuario = service.guardar(dto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                usuario,
                                "Usuario registrado correctamente."
                        )
                );

    }

    /**
     * Actualizar usuario
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO dto) {

        UsuarioResponseDTO usuario = service.actualizar(id, dto);

        return ResponseEntity.ok(
                ApiResponse.success(
                        usuario,
                        "Usuario actualizado correctamente."
                )
        );

    }

    /**
     * Eliminar usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> eliminar(
            @PathVariable Long id) {

        service.eliminar(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        null,
                        "Usuario eliminado correctamente."
                )
        );

    }

}