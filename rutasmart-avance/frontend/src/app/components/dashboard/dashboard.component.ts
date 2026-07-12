import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { ReservaService } from '../../services/reserva.service';
import { BusService } from '../../services/bus.service';
import { DashboardKpis, Reserva, Bus } from '../../models';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard">
      <section class="cards">
        <div class="card alumnos"><div><small>ALUMNOS</small><h2>{{ kpis?.alumnos ?? 0 }}</h2></div><i class="bi bi-mortarboard-fill"></i></div>
        <div class="card buses"><div><small>BUSES</small><h2>{{ kpis?.buses ?? 0 }}</h2></div><i class="bi bi-bus-front-fill"></i></div>
        <div class="card reservas"><div><small>RESERVAS</small><h2>{{ kpis?.reservas ?? 0 }}</h2></div><i class="bi bi-ticket-perforated-fill"></i></div>
        <div class="card incidencias"><div><small>INCIDENCIAS</small><h2>{{ kpis?.incidencias ?? 0 }}</h2></div><i class="bi bi-exclamation-triangle-fill"></i></div>
      </section>

      <section class="charts">
        <div class="chart-card">
          <div class="card-header"><h3>Reservas por Día</h3><button (click)="irReportes()">Ver Reporte</button></div>
          <canvas #reservasChart></canvas>
        </div>
        <div class="chart-card">
          <div class="card-header"><h3>Estado de la Flota</h3><button (click)="irTransporte()">Detalles</button></div>
          <canvas #flotaChart></canvas>
        </div>
      </section>

      <section class="info-grid">
        <div class="panel">
          <div class="panel-title"><h3><i class="bi bi-bus-front"></i> Últimos Viajes</h3></div>
          <table>
            <thead><tr><th>Bus</th><th>Ruta</th><th>Chofer</th><th>Estado</th></tr></thead>
            <tbody>
              <tr *ngFor="let b of buses">
                <td>{{ b.codigo }}</td><td>{{ b.ruta }}</td><td>{{ b.chofer }}</td>
                <td><span class="status" [ngClass]="estadoClase(b.estado)">{{ b.estado }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel">
          <div class="panel-title"><h3><i class="bi bi-ticket-perforated-fill"></i> Últimas Reservas</h3></div>
          <table>
            <thead><tr><th>Alumno</th><th>Ruta</th><th>Estado</th></tr></thead>
            <tbody>
              <tr *ngFor="let r of reservas">
                <td>{{ r.alumno }}</td><td>{{ r.ruta }}</td>
                <td><span class="status" [ngClass]="estadoReserva(r.estado)">{{ r.estado }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  `,
})
export class DashboardComponent implements AfterViewInit {
  private reporteSvc = inject(ReporteService);
  private reservaSvc = inject(ReservaService);
  private busSvc = inject(BusService);
  private router = inject(Router);

  kpis?: DashboardKpis;
  reservas: Reserva[] = [];
  buses: Bus[] = [];

  @ViewChild('reservasChart') reservasCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flotaChart') flotaCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    this.reporteSvc.dashboard().subscribe(k => (this.kpis = k));
    this.reservaSvc.listar().subscribe(r => (this.reservas = r.slice(0, 5)));
    this.busSvc.listar().subscribe(b => (this.buses = b.slice(0, 5)));
  }

  ngAfterViewInit() {
    new Chart(this.reservasCanvas.nativeElement, {
      type: 'line',
      data: { labels: ['Lun','Mar','Mié','Jue','Vie','Sáb'],
        datasets: [{ label: 'Reservas', data: [35,42,51,60,48,73], borderColor: '#155bc9', backgroundColor: 'rgba(21,91,201,.15)', fill: true, tension: .4 }] },
      options: { responsive: true, plugins: { legend: { display: false } } } });
    new Chart(this.flotaCanvas.nativeElement, {
      type: 'doughnut',
      data: { labels: ['Operativos','En Ruta','Mantenimiento'], datasets: [{ data: [10,8,2], backgroundColor: ['#22c55e','#f59e0b','#ef4444'] }] },
      options: { responsive: true } });
  }

  estadoClase(e?: string) {
    if (e === 'DISPONIBLE') return 'ok';
    if (e === 'EN_RUTA') return 'warning';
    return 'danger';
  }
  estadoReserva(e: string) {
    if (e === 'CONFIRMADA') return 'ok';
    if (e === 'PENDIENTE') return 'warning';
    return 'danger';
  }
  irReportes() { this.router.navigate(['/app/reportes']); }
  irTransporte() { this.router.navigate(['/app/transporte']); }
}
