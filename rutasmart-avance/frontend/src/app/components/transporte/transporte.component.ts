import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusService } from '../../services/bus.service';
import { Bus } from '../../models';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title">
        <div><h2>Centro de Operaciones</h2><p>Control de buses, rutas y choferes.</p></div>
        <button class="btn-primary" (click)="abrirNuevo()"><i class="bi bi-plus-circle"></i> Nuevo Bus</button>
      </div>

      <section class="cards">
        <div class="card alumnos"><div><small>BUSES</small><h2>{{ buses.length }}</h2></div><i class="bi bi-bus-front-fill"></i></div>
        <div class="card buses"><div><small>RUTAS</small><h2>3</h2></div><i class="bi bi-sign-turn-right-fill"></i></div>
        <div class="card reservas"><div><small>CHOFERES</small><h2>{{ choferes }}</h2></div><i class="bi bi-person-badge-fill"></i></div>
        <div class="card incidencias"><div><small>VIAJES HOY</small><h2>26</h2></div><i class="bi bi-calendar-check-fill"></i></div>
      </section>

      <div class="panel" style="margin-top:20px;">
        <div class="panel-title"><h3>Flota de Transporte</h3></div>
        <table>
          <thead><tr><th>Bus</th><th>Placa</th><th>Ruta</th><th>Chofer</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr *ngFor="let b of buses">
              <td>{{ b.codigo }}</td><td>{{ b.placa }}</td><td>{{ b.ruta }}</td><td>{{ b.chofer }}</td>
              <td><span class="status" [ngClass]="estadoClase(b.estado)">{{ b.estado }}</span></td>
              <td>
                <button class="edit" (click)="abrirEditar(b)"><i class="bi bi-pencil-square"></i></button>
                <button class="delete" (click)="eliminar(b)"><i class="bi bi-trash-fill"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal" [class.active]="modalAbierto">
        <div class="modal-content" style="max-width:480px;text-align:left;">
          <span class="close" (click)="cerrar()">&times;</span>
          <h3>{{ editando ? 'Editar Bus' : 'Nuevo Bus' }}</h3>
          <div class="input-group"><label>Código</label><input [(ngModel)]="form.codigo"></div>
          <div class="input-group"><label>Placa</label><input [(ngModel)]="form.placa"></div>
          <div class="input-group"><label>Ruta</label>
            <select [(ngModel)]="form.ruta"><option>Ruta Norte</option><option>Ruta Sur</option><option>Ruta Centro</option></select>
          </div>
          <div class="input-group"><label>Chofer</label><input [(ngModel)]="form.chofer"></div>
          <div class="input-group"><label>Estado</label>
            <select [(ngModel)]="form.estado"><option>DISPONIBLE</option><option>EN_RUTA</option><option>MANTENIMIENTO</option></select>
          </div>
          <div style="text-align:right;margin-top:15px;">
            <button class="btn-secondary" (click)="cerrar()">Cancelar</button>
            <button class="btn-primary" (click)="guardar()">Guardar</button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class TransporteComponent {
  private svc = inject(BusService);
  buses: Bus[] = [];
  modalAbierto = false;
  editando: Bus | null = null;
  form: Bus = this.vacio();

  constructor() { this.cargar(); }

  cargar() { this.svc.listar().subscribe(b => (this.buses = b)); }
  get choferes() { return new Set(this.buses.map(b => b.chofer).filter(Boolean)).size; }

  abrirNuevo() { this.editando = null; this.form = this.vacio(); this.modalAbierto = true; }
  abrirEditar(b: Bus) { this.editando = b; this.form = { ...b }; this.modalAbierto = true; }
  cerrar() { this.modalAbierto = false; }

  guardar() {
    if (this.editando && this.editando.id) {
      this.svc.actualizar(this.editando.id, this.form).subscribe(() => { this.cerrar(); this.cargar(); });
    } else {
      this.svc.crear(this.form).subscribe(() => { this.cerrar(); this.cargar(); });
    }
  }
  eliminar(b: Bus) { if (b.id && confirm('¿Eliminar bus?')) this.svc.eliminar(b.id).subscribe(() => this.cargar()); }

  estadoClase(e?: string) {
    if (e === 'DISPONIBLE') return 'ok';
    if (e === 'EN_RUTA') return 'warning';
    return 'danger';
  }
  vacio(): Bus { return { codigo: '', placa: '', ruta: 'Ruta Norte', chofer: '', estado: 'DISPONIBLE' }; }
}
