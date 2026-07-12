import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Reserva } from '../../models';

@Component({
  selector: 'app-alumno-reservas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title"><div><h2>Selecciona tu Ruta y Hora</h2><p>Reserva tu asiento para el día de hoy</p></div></div>

      <div class="panel">
        <div class="panel-title"><h3><i class="bi bi-ticket-perforated-fill"></i> Nueva Reserva</h3></div>
        <div class="ruta-selector"><label>Ruta:</label>
          <select [(ngModel)]="ruta">
            <option value="Norte">Ruta Norte</option>
            <option value="Sur">Ruta Sur</option>
            <option value="Centro">Ruta Centro</option>
          </select>
        </div>
        <div class="hora-selector" style="margin-top:20px;">
          <label>Hora:</label>
          <div class="horarios-grid">
            <button type="button" class="hora-btn" [class.active]="hora==='20:00'" (click)="hora='20:00'">8:00 PM</button>
            <button type="button" class="hora-btn" [class.active]="hora==='21:00'" (click)="hora='21:00'">9:00 PM</button>
            <button type="button" class="hora-btn" [class.active]="hora==='22:00'" (click)="hora='22:00'">10:00 PM</button>
          </div>
        </div>
        <button class="btn-primary" style="margin-top:25px;" (click)="reservar()" [disabled]="!hora">Reservar</button>
      </div>

      <div class="panel" style="margin-top:20px;">
        <div class="panel-title"><h3>Mis Reservas</h3></div>
        <table>
          <thead><tr><th>Alumno</th><th>Ruta</th><th>Hora</th><th>Estado</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of misReservas">
              <td>{{ r.alumno }}</td><td>{{ r.ruta }}</td><td>{{ r.hora }}</td>
              <td><span class="status" [ngClass]="estadoClase(r.estado)">{{ r.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class AlumnoReservasComponent {
  private svc = inject(ReservaService);
  private auth = inject(AuthService);
  ruta = 'Norte';
  hora = '';
  misReservas: Reserva[] = [];

  constructor() { this.cargar(); }

  cargar() {
    const nombre = this.auth.user()?.name ?? '';
    this.svc.listar().subscribe(rs => (this.misReservas = rs.filter(r => r.alumno === nombre)));
  }

  reservar() {
    const r: Reserva = { alumno: this.auth.user()?.name ?? '', ruta: this.ruta, fecha: new Date().toISOString().split('T')[0], hora: this.hora, estado: 'PENDIENTE' };
    this.svc.crear(r).subscribe(() => this.cargar());
  }

  estadoClase(e: string) {
    if (e === 'CONFIRMADA') return 'ok';
    if (e === 'PENDIENTE') return 'warning';
    return 'danger';
  }
}
