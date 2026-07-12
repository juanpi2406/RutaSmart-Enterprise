import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Estructura de tu ApiResponse de Java
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Estructura de tu LoginResponse de Spring Boot

export interface LoginResponse {
  idUsuario: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string; // "Administrador", "Chofer", "Alumno"
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth/login';

  enviarLogin(datos: any): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(this.apiUrl, datos);
  }
}
