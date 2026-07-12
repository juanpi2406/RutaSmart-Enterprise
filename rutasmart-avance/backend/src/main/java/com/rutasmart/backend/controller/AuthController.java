package com.rutasmart.backend.controller;

import com.rutasmart.backend.config.JwtUtil;
import com.rutasmart.backend.dto.AuthRequest;
import com.rutasmart.backend.dto.AuthResponse;
import com.rutasmart.backend.model.Usuario;
import com.rutasmart.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        Optional<Usuario> opt = usuarioRepository.findByCorreo(req.usuario());
        if (opt.isEmpty() || !req.password().equals(opt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
        Usuario u = opt.get();
        String token = jwtUtil.generateToken(u.getCorreo(), u.getRol());
        return ResponseEntity.ok(new AuthResponse(token, u.getNombre(), u.getRol()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestAttribute String userSubject) {
        Optional<Usuario> opt = usuarioRepository.findByCorreo(userSubject);
        if (opt.isEmpty()) return ResponseEntity.status(401).build();
        Usuario u = opt.get();
        return ResponseEntity.ok(Map.of(
                "name", u.getNombre(),
                "role", u.getRol(),
                "correo", u.getCorreo()));
    }
}
