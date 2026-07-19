package com.rutasmart.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * Login
     */

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> authenticationException(
            AuthenticationException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(ex.getMessage()));

    }

    /*
     * Recursos inexistentes
     */

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> resourceNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));

    }

    /*
     * Reglas de negocio
     */

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Object>> businessException(
            BusinessException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));

    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> dataIntegrity(
            DataIntegrityViolationException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(
                        "No se puede eliminar porque tiene registros relacionados (viajes, reservas, paraderos, etc.)."));

    }

    /*
     * Errores generales
     */

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> illegalArgument(
            IllegalArgumentException ex) {

        return ResponseEntity.badRequest()
                .body(ApiResponse.error("Datos inválidos en la solicitud. Verifica e inténtalo nuevamente."));

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> generalException(
            Exception ex) {

        log.error("Error no controlado — tipo: {} | mensaje: {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Ocurrió un error inesperado en el servidor."));

    }




    @ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<Object>> validationException(
        MethodArgumentNotValidException ex) {

    String mensaje = ex.getBindingResult()
            .getFieldErrors()
            .get(0)
            .getDefaultMessage();

    return ResponseEntity.badRequest()
            .body(ApiResponse.error(mensaje));
}

}