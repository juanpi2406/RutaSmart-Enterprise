import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alumno-historial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title"><div><h2>Mis Reservas</h2><p>Historial de viajes realizados</p></div></div>
      <div class="panel">
        <table>
          <thead><tr><th>Fecha</th><th>Ruta</th><th>Hora</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>02 Julio 2026</td><td>Mall del Sur</td><td>8:30 PM</td><td><span class="status ok">Completado</span></td></tr>
            <tr><td>01 Julio 2026</td><td>Villa El Salvador</td><td>9:00 PM</td><td><span class="status ok">Completado</span></td></tr>
            <tr><td>30 Junio 2026</td><td>Mall del Sur</td><td>10:00 PM</td><td><span class="status ok">Completado</span></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class AlumnoHistorialComponent {}
