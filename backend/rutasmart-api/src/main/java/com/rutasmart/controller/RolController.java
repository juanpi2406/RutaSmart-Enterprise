package com.rutasmart.controller;

import com.rutasmart.dto.RolDTO;
import com.rutasmart.service.interfaces.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.rutasmart.exception.ApiResponse;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolController {

    private final RolService service;

@GetMapping
public ResponseEntity<ApiResponse<List<RolDTO>>> listar() {

    return ResponseEntity.ok(
            ApiResponse.success(
                    service.listar(),
                    "Listado de roles."
            )
    );

}

@GetMapping("/{id}")
public ResponseEntity<ApiResponse<RolDTO>> buscar(@PathVariable Long id) {

    return ResponseEntity.ok(
            ApiResponse.success(
                    service.buscarPorId(id),
                    "Rol encontrado."
            )
    );

}

@PostMapping
public ResponseEntity<ApiResponse<RolDTO>> guardar(
        @RequestBody RolDTO dto) {

    RolDTO rol = service.guardar(dto);

    return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                    rol,
                    "Rol creado correctamente."
            ));

}

@PutMapping("/{id}")
public ResponseEntity<ApiResponse<RolDTO>> actualizar(
        @PathVariable Long id,
        @RequestBody RolDTO dto) {

    RolDTO rol = service.actualizar(id, dto);

    return ResponseEntity.ok(
            ApiResponse.success(
                    rol,
                    "Rol actualizado correctamente."
            )
    );

}

@DeleteMapping("/{id}")
public ResponseEntity<ApiResponse<Object>> eliminar(
        @PathVariable Long id) {

    service.eliminar(id);

    return ResponseEntity.ok(
            ApiResponse.success(
                    null,
                    "Rol eliminado correctamente."
            )
    );

}

}