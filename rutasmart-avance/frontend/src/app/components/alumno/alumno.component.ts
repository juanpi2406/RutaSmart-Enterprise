import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alumno',
  standalone: true,
  template: `
    <section class="dashboard">
      <div class="panel">
        <h2>Bienvenido, {{ usuario()?.name }}</h2>
        <p>Usuario: {{ usuario()?.correo }} | Código: 2024001</p>
      </div>
      <section class="cards">
        <div class="card alumnos"><div><small>MIS RESERVAS ACTIVAS</small><h2>2</h2></div><i class="bi bi-ticket-perforated-fill"></i></div>
        <div class="card buses"><div><small>VIAJES ESTE MES</small><h2>12</h2></div><i class="bi bi-bus-front-fill"></i></div>
        <div class="card reservas"><div><small>INCIDENCIAS</small><h2>1</h2></div><i class="bi bi-exclamation-triangle-fill"></i></div>
      </section>
    </section>
  `,
})
export class AlumnoComponent {
  private auth = inject(AuthService);
  usuario = this.auth.user;
}
