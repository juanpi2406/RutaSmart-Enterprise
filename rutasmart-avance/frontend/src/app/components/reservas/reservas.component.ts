import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title">
        <div><h2>Reservas de Transporte</h2><p>Administra las reservas de los alumnos por ruta.</p></div>
        <button class="btn-primary" (click)="abrirNuevo()"><i class="bi bi-plus-circle"></i> Nueva Reserva</button>
      </div>

      <section class="cards">
        <div class="card alumnos"><div><small>TOTAL</small><h2>{{ reservas.length }}</h2></div><i class="bi bi-ticket-perforated-fill"></i></div>
        <div class="card buses"><div><small>CONFIRMADAS</small><h2>{{ confirmadas }}</h2></div><i class="bi bi-check-circle-fill"></i></div>
        <div class="card reservas"><div><small>PENDIENTES</small><h2>{{ pendientes }}</h2></div><i class="bi bi-hourglass-split"></i></div>
        <div class="card incidencias"><div><small>CANCELADAS</small><h2>{{ canceladas }}</h2></div><i class="bi bi-x-circle-fill"></i></div>
      </section>

      <div class="panel">
        <div class="toolbar">
          <input type="text" [(ngModel)]="filtro" (ngModelChange)="filtrar()" placeholder="Buscar por alumno o ruta...">
          <select [(ngModel)]="filtroEstado" (ngModelChange)="filtrar()">
            <option value="">Todos los estados</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <select [(ngModel)]="filtroRuta" (ngModelChange)="filtrar()">
            <option value="">Todas las rutas</option>
            <option value="Norte">Norte</option><option value="Sur">Sur</option><option value="Centro">Centro</option>
          </select>
        </div>
      </div>

      <div class="panel" style="margin-top:20px;">
        <div class="panel-title"><h3>Lista de Reservas</h3>
          <button class="btn-secondary" (click)="reset()">Restaurar</button>
        </div>
        <table>
          <thead><tr><th>ID</th><th>Alumno</th><th>Ruta</th><th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of filtrados">
              <td>{{ r.id }}</td><td>{{ r.alumno }}</td><td>{{ r.ruta }}</td><td>{{ r.fecha }}</td><td>{{ r.hora }}</td>
              <td><span class="status" [ngClass]="estadoClase(r.estado)">{{ r.estado }}</span></td>
              <td>
                <button class="edit" (click)="abrirEditar(r)"><i class="bi bi-pencil-square"></i></button>
                <button class="delete" (click)="eliminar(r)"><i class="bi bi-trash-fill"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <section class="charts">
        <div class="chart-card">
          <div class="card-header"><h3>Reservas por Ruta</h3><button (click)="irReportes()">Ver Reporte</button></div>
          <canvas #rutaChart></canvas>
        </div>
        <div class="chart-card">
          <div class="card-header"><h3>Estado de Reservas</h3></div>
          <canvas #estadoChart></canvas>
        </div>
      </section>

      <div class="modal" [class.active]="modalAbierto">
        <div class="modal-content" style="max-width:480px;text-align:left;">
          <span class="close" (click)="cerrar()">&times;</span>
          <h3>{{ editando ? 'Editar Reserva' : 'Nueva Reserva' }}</h3>
          <div class="input-group"><label>Alumno</label><input [(ngModel)]="form.alumno"></div>
          <div class="input-group"><label>Ruta</label>
            <select [(ngModel)]="form.ruta"><option>Norte</option><option>Sur</option><option>Centro</option></select>
          </div>
          <div class="input-group" style="display:flex;gap:15px;">
            <div style="flex:1;"><label>Fecha</label><input type="date" [(ngModel)]="form.fecha"></div>
            <div style="flex:1;"><label>Hora</label><input type="time" [(ngModel)]="form.hora"></div>
          </div>
          <div class="input-group"><label>Estado</label>
            <select [(ngModel)]="form.estado"><option>CONFIRMADA</option><option>PENDIENTE</option><option>CANCELADA</option></select>
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
export class ReservasComponent implements AfterViewInit {
  private svc = inject(ReservaService);
  private router = inject(Router);
  reservas: Reserva[] = [];
  filtrados: Reserva[] = [];
  filtro = ''; filtroEstado = ''; filtroRuta = '';
  modalAbierto = false; editando: Reserva | null = null;
  form: Reserva = this.vacio();
  @ViewChild('rutaChart') rutaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('estadoChart') estadoCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() { this.cargar(); }

  cargar() { this.svc.listar().subscribe(r => { this.reservas = r; this.filtrar(); this.dibujar(); }); }
  get confirmadas() { return this.reservas.filter(r => r.estado === 'CONFIRMADA').length; }
  get pendientes() { return this.reservas.filter(r => r.estado === 'PENDIENTE').length; }
  get canceladas() { return this.reservas.filter(r => r.estado === 'CANCELADA').length; }

  filtrar() {
    const t = this.filtro.toLowerCase();
    this.filtrados = this.reservas.filter(r =>
      (r.alumno.toLowerCase().includes(t) || r.ruta.toLowerCase().includes(t)) &&
      (!this.filtroEstado || r.estado === this.filtroEstado) &&
      (!this.filtroRuta || r.ruta === this.filtroRuta));
  }

  abrirNuevo() { this.editando = null; this.form = this.vacio(); this.modalAbierto = true; }
  abrirEditar(r: Reserva) { this.editando = r; this.form = { ...r }; this.modalAbierto = true; }
  cerrar() { this.modalAbierto = false; }
  reset() { this.cargar(); }
  irReportes() { this.router.navigate(['/app/reportes']); }

  guardar() {
    if (this.editando && this.editando.id) {
      this.svc.actualizar(this.editando.id, this.form).subscribe(() => { this.cerrar(); this.cargar(); });
    } else {
      this.svc.crear(this.form).subscribe(() => { this.cerrar(); this.cargar(); });
    }
  }
  eliminar(r: Reserva) { if (r.id && confirm('¿Eliminar reserva?')) this.svc.eliminar(r.id).subscribe(() => this.cargar()); }

  estadoClase(e: string) {
    if (e === 'CONFIRMADA') return 'ok';
    if (e === 'PENDIENTE') return 'warning';
    return 'danger';
  }
  vacio(): Reserva { return { alumno: '', ruta: 'Norte', fecha: new Date().toISOString().split('T')[0], hora: '07:00', estado: 'CONFIRMADA' }; }

  ngAfterViewInit() { this.dibujar(); }
  dibujar() {
    if (!this.rutaCanvas) return;
    const rutas = ['Norte', 'Sur', 'Centro'];
    const conteo = rutas.map(ru => this.reservas.filter(r => r.ruta === ru).length);
    new Chart(this.rutaCanvas.nativeElement, { type: 'bar', data: { labels: rutas, datasets: [{ label: 'Reservas', data: conteo, backgroundColor: '#155bc9', borderRadius: 8 }] }, options: { responsive: true } });
    new Chart(this.estadoCanvas.nativeElement, { type: 'doughnut', data: { labels: ['Confirmadas', 'Pendientes', 'Canceladas'], datasets: [{ data: [this.confirmadas, this.pendientes, this.canceladas], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }] }, options: { responsive: true } });
  }
}
