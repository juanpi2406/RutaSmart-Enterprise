import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IncidenciaService } from '../../services/incidencia.service';
import { AuthService } from '../../services/auth.service';
import { Incidencia } from '../../models';

@Component({
  selector: 'app-chofer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="dashboard">
      <ul class="menu" style="display:flex;gap:10px;margin-bottom:25px;">
        <li [class.active]="tab==='viajes'"><a (click)="tab='viajes'" style="cursor:pointer;"><i class="bi bi-geo-alt-fill"></i> Mis Viajes</a></li>
        <li [class.active]="tab==='perfil'"><a (click)="tab='perfil'" style="cursor:pointer;"><i class="bi bi-person-fill"></i> Mi Perfil</a></li>
        <li [class.active]="tab==='incidencias'"><a (click)="tab='incidencias'" style="cursor:pointer;"><i class="bi bi-exclamation-triangle-fill"></i> Incidencias</a></li>
      </ul>

      <div [ngClass]="{'pagina':true}" *ngIf="tab==='viajes'">
        <section class="cards">
          <div class="card alumnos"><div><small>BUS</small><h2>BUS-01</h2></div><i class="bi bi-bus-front-fill"></i></div>
          <div class="card buses"><div><small>RUTA</small><h2>Norte</h2></div><i class="bi bi-sign-turn-right-fill"></i></div>
          <div class="card reservas"><div><small>PASAJEROS</small><h2>0 / 30</h2></div><i class="bi bi-people-fill"></i></div>
          <div class="card incidencias"><div><small>ESTADO</small><h2>Listo</h2></div><i class="bi bi-check-circle-fill"></i></div>
        </section>
        <div class="panel"><div class="panel-title"><h3>Mapa de Rutas</h3></div>
          <div class="map-placeholder"><i class="bi bi-map"></i><h2>Google Maps</h2><p>Ubicación en tiempo real de los buses.</p></div>
        </div>
      </div>

      <div *ngIf="tab==='perfil'" class="config-grid">
        <div class="panel perfil-card">
          <h2>{{ usuario?.name }}</h2><p>Chofer Principal</p><hr style="margin:20px 0;border:none;border-top:1px solid var(--line);">
          <div class="input-group" style="text-align:left;"><label>DNI</label><input [(ngModel)]="dni"></div>
          <div class="input-group" style="text-align:left;"><label>Licencia</label><input [(ngModel)]="licencia"></div>
          <div class="input-group" style="text-align:left;"><label>Vencimiento</label><input type="date" [(ngModel)]="vencimiento"></div>
          <div class="input-group" style="text-align:left;"><label>Teléfono</label><input [(ngModel)]="telefono"></div>
          <div class="input-group" style="text-align:left;"><label>Correo</label><input [(ngModel)]="correo"></div>
          <button class="btn-primary" style="margin-top:15px;width:100%;justify-content:center;" (click)="guardarPerfil()"><i class="bi bi-check-circle-fill"></i> Guardar Cambios</button>
        </div>
      </div>

      <div *ngIf="tab==='incidencias'">
        <div class="incidencias-layout">
          <div class="incidencias-main">
            <div class="panel">
              <div class="panel-title"><h3><i class="bi bi-exclamation-triangle-fill"></i> Reportar Incidencia</h3></div>
              <form (ngSubmit)="enviar()">
                <div class="input-group"><label>Tipo:</label>
                  <select [(ngModel)]="tipo" name="tipo"><option>Conductor</option><option>Bus</option><option>Ruta</option></select>
                </div>
                <div class="input-group" style="margin-top:15px;"><label>Descripción:</label>
                  <textarea [(ngModel)]="descripcion" name="descripcion" rows="3"></textarea>
                </div>
                <div class="input-group" style="margin-top:15px;"><label>Fecha:</label>
                  <input type="date" [(ngModel)]="fecha" name="fecha">
                </div>
                <button type="submit" class="btn-primary" style="margin-top:15px;"><i class="bi bi-send"></i> Enviar Reporte</button>
              </form>
            </div>
          </div>
          <aside class="incidencias-sidebar">
            <div class="panel">
              <div class="panel-title"><h3>Mis Incidencias</h3></div>
              <div class="incidencia-list">
                <div class="incidencia-item" *ngFor="let i of incidencias">
                  <div class="incidencia-header">
                    <span class="status" [ngClass]="estadoClase(i.estado)">{{ i.estado }}</span>
                    <small>{{ i.fecha }}</small>
                  </div>
                  <p>{{ i.descripcion }}</p>
                  <small>Reportada por: {{ i.reportadoPor || usuario?.name }}</small>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `,
})
export class ChoferComponent {
  private incSvc = inject(IncidenciaService);
  private auth = inject(AuthService);
  usuario = this.auth.user;
  tab = 'viajes';

  dni = '74125896'; licencia = 'A-IIIB'; vencimiento = '2028-12-15'; telefono = '999 888 777'; correo = this.usuario()?.correo ?? '';
  tipo = 'Conductor'; descripcion = ''; fecha = new Date().toISOString().split('T')[0];
  incidencias: Incidencia[] = [];

  constructor() { this.cargar(); }

  cargar() { this.incSvc.listar().subscribe(i => (this.incidencias = i)); }

  guardarPerfil() {
    const u = { name: this.usuario()?.name ?? '', role: this.usuario()?.role ?? '', correo: this.correo };
    localStorage.setItem('rs_user', JSON.stringify(u));
    this.auth.user.set(u);
    alert('Perfil actualizado');
  }

  enviar() {
    if (!this.descripcion.trim() || !this.fecha) { alert('Completa descripción y fecha'); return; }
    const inc: Incidencia = { tipo: this.tipo, descripcion: this.descripcion, fecha: this.fecha, estado: 'Activa', reportadoPor: this.usuario()?.name };
    this.incSvc.crear(inc).subscribe(() => { this.descripcion = ''; this.cargar(); });
  }

  estadoClase(e?: string) {
    if (e === 'Activa') return 'danger';
    if (e === 'En revision') return 'warning';
    return 'ok';
  }
}
