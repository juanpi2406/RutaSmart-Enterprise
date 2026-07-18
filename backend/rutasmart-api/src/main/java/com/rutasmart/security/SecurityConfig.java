package com.rutasmart.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                
                // Mantiene el comportamiento predeterminado, el cual buscará el bean corsConfigurationSource() de abajo
                .cors(Customizer.withDefaults())

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/usuarios/**",
                                "/swagger-ui/**",
                                "/swagger",
                                "/api/dashboard/**",
                                "/api-docs/**",
                                "/v3/api-docs/**",
                                "/api/health/**",
                                "/api/ubicaciones/**",
                                "/api/notificaciones/**",
                                "/ws/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ==========================================
    // CONFIGURACIÓN GLOBAL DE CORS PARA LA DEMO
    // ==========================================
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite las llamadas desde cualquier origen para asegurar el funcionamiento de tu demo/sustentación
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app"
        ));
        
        // Permite los métodos necesarios para tu login y transacciones
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Permite enviar cabeceras estándar de autenticación (como el token JWT en "Authorization")
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        
        // Permite que el navegador lea el header de autenticación que responda tu backend
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        // Permite el uso de credenciales/cookies si fuera necesario
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta política a todos los endpoints de la API
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
