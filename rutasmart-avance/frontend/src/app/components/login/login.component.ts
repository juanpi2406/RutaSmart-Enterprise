import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  rol: string = 'administrador';
  usuario: string = '';
  password: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  seleccionarRol(r: string) {
    this.rol = r;
  }

  ingresar() {
    if (!this.usuario || !this.password) return;
    this.auth.login(this.usuario, this.password).subscribe({
      next: () => this.router.navigate(['/app/dashboard']),
      error: () => alert('Usuario o contraseña incorrectos'),
    });
  }
}
