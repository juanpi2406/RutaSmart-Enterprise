package com.rutasmart.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El código es obligatorio.")
    private String codigo;

    @NotBlank(message = "La contraseña es obligatoria.")
    private String password;

}