package com.rutasmart.controller;

import com.rutasmart.dto.request.LoginRequest;
import com.rutasmart.dto.response.LoginResponse;
import com.rutasmart.exception.ApiResponse;
import com.rutasmart.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /**
     * Inicio de sesión.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        response,
                        "Inicio de sesión exitoso."
                )
        );

    }

}