package com.rutasmart.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

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

    /*
     * Errores generales
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> generalException(
            Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.getMessage()));

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