import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../service/auth';
import { SessionService } from '../service/session';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private session = inject(SessionService);
  private router = inject(Router);

  errorMessage = '';

  credentials = {
    username: '',
    password: ''
  };

  onLogin(): void {

    this.errorMessage = '';

    const loginPayload = {

      codigo: this.credentials.username,

      password: this.credentials.password

    };

    console.log('Login:', loginPayload);

    this.authService.enviarLogin(loginPayload).subscribe({

      next: (response) => {

        console.log('Respuesta:', response);

        this.session.guardar(response.data);

        this.router.navigate([
          '/dashboard'
        ]);

      },

      error: (err) => {

        console.error(err);

        this.errorMessage =
          'Código o contraseña incorrectos.';

      }

    });

  }

}
