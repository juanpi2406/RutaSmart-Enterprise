import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../services/incidencia.service';
import { AuthService } from '../../services/auth.service';
import { Incidencia } from '../../models';

@Component({
  selector: 'app-alumno-incidencias',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title"><div><h2>Reportar Incidencia</h2><p>¿Tuviste un problema con tu viaje? Reportalo aquí</p></div></div>
      <div class="panel">
        <form (ngSubmit)="enviar()">
          <div class="input-group"><label>Tipo:</label>
            <select [(ngModel)]="tipo" name="tipo">
              <option value="reclamo">Reclamo</option>
              <option value="incidencia">Incidencia</option>
              <option value="mejora">Mejora Sugerida</option>
            </select>
          </div>
          <div class="input-group" style="margin-top:15px;"><label>Ruta:</label>
            <select [(ngModel)]="ruta" name="ruta">
              <option value="ruta1">Ruta 1 - Mall del Sur</option>
              <option value="ruta2">Ruta 2 - Villa El Salvador</option>
            </select>
          </div>
          <div class="input-group" style="margin-top:15px;"><label>Fecha:</label>
            <input type="date" [(ngModel)]="fecha" name="fecha">
          </div>
          <div class="input-group" style="margin-top:15px;"><label>Descripción:</label>
            <textarea [(ngModel)]="descripcion" name="descripcion" rows="4"></textarea>
          </div>
          <button type="submit" class="btn-primary" style="margin-top:15px;"><i class="bi bi-send"></i> Enviar Reporte</button>
        </form>
      </div>
      <div class="panel" style="margin-top:20px;">
        <div class="panel-title"><h3><i class="bi bi-list"></i> Mis Reportes Anteriores</h3></div>
        <table>
          <thead><tr><th>Fecha</th><th>Tipo</th><th>Ruta</th><th>Estado</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of reportes">
              <td>{{ r.fecha }}</td>
              <td><span class="status warning">{{ r.tipo }}</span></td>
              <td>{{ r.ruta }}</td>
              <td><span class="status" [ngClass]="estadoClase(r.estado)">{{ r.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class AlumnoIncidenciasComponent {
  private svc = inject(IncidenciaService);
  private auth = inject(AuthService);
  tipo = 'reclamo';
  ruta = 'ruta1';
  fecha = new Date().toISOString().split('T')[0];
  descripcion = '';
  reportes: any[] = [{ fecha: '02 Julio 2026', tipo: 'Incidencia', ruta: 'Mall del Sur', estado: 'Resuelto' }];

  enviar() {
    if (!this.descripcion.trim()) { alert('Completa la descripción'); return; }
    const inc: Incidencia = {
      tipo: this.tipo, descripcion: this.descripcion,
      fecha: this.fecha, estado: 'En revision',
      reportadoPor: this.auth.user()?.name,
    };
    this.svc.crear(inc).subscribe(() => {
      this.reportes.unshift({ fecha: this.fecha, tipo: this.tipo, ruta: this.ruta === 'ruta1' ? 'Mall del Sur' : 'Villa El Salvador', estado: 'En revision' });
      this.descripcion = '';
    });
  }

  estadoClase(e: string) { return e === 'Resuelto' ? 'ok' : 'warning'; }
}
