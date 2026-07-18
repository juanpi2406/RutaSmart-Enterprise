import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../service/auth';
import { SessionService } from '../service/session';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  private authService = inject(AuthService);
  private session = inject(SessionService);
  private router = inject(Router);

  errorMessage = '';
  cargando = false;
  showPw = false;
  sesionActivaNombre = '';

  credentials = {
    username: '',
    password: ''
  };

  ngOnInit(): void {
    const sesion = this.session.obtener();
    if (sesion) {
      this.sesionActivaNombre = `${sesion.nombres ?? ''} ${sesion.apellidos ?? ''}`.trim()
        || sesion.codigo
        || 'Usuario activo';
    }
  }

  cerrarSesionPestana(): void {
    this.session.eliminar();
    this.sesionActivaNombre = '';
    this.credentials = { username: '', password: '' };
    this.errorMessage = '';
  }

  onLogin(): void {
    if (this.cargando) {
      return;
    }

    this.errorMessage = '';
    this.cargando = true;

    const loginPayload = {
      codigo: this.credentials.username,
      password: this.credentials.password
    };

    this.authService.enviarLogin(loginPayload).subscribe({
      next: (response) => {
        this.session.guardar(response.data);
        this.sesionActivaNombre = '';
        if ((response.data.rol ?? '').toUpperCase() === 'ALUMNO') {
          sessionStorage.setItem('rutasmart-mostrar-sancion', '1');
        }
        this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        this.cargando = false;
        if (error instanceof HttpErrorResponse && error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté activo en el puerto 8080.';
          return;
        }
        this.errorMessage = 'Código o contraseña incorrectos.';
      }
    });
  }

}
