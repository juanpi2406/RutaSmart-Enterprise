package com.rutasmart.service.impl;

import com.rutasmart.dto.request.LoginRequest;
import com.rutasmart.dto.response.LoginResponse;
import com.rutasmart.entity.Usuario;
import com.rutasmart.exception.AuthenticationException;
import com.rutasmart.repository.UsuarioRepository;
import com.rutasmart.security.JwtService;
import com.rutasmart.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public LoginResponse login(LoginRequest request) {

        // Buscar usuario por código
        Usuario usuario = usuarioRepository.findByCodigo(request.getCodigo())
                .orElseThrow(() ->
                        new AuthenticationException("Código o contraseña incorrectos."));

        // Verificar estado
        if (!Boolean.TRUE.equals(usuario.getEstado())) {
            throw new AuthenticationException("El usuario se encuentra inactivo.");
        }

        // Validar contraseña
        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPasswordHash())) {

            throw new AuthenticationException("Código o contraseña incorrectos.");
        }

        // Actualizar último login
        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);

        // Generar token JWT
        String token = jwtService.generarToken(usuario);

        // Construir respuesta
        return LoginResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .codigo(usuario.getCodigo())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol().getNombre())
                .estado(usuario.getEstado())
                .token(token)
                .build();
    }
}