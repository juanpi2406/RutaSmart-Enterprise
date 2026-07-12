import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { ReporteResumen } from '../../models';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title">
        <div><h2>Reportes de Operación</h2><p>Indicadores de reservas, flota e incidencias.</p></div>
        <div style="display:flex;gap:15px;">
          <button class="btn-primary" (click)="exportarCSV()"><i class="bi bi-download"></i> Exportar CSV</button>
          <button class="btn-secondary" (click)="imprimir()"><i class="bi bi-printer"></i> Imprimir</button>
        </div>
      </div>

      <section class="cards" *ngIf="resumen">
        <div class="card alumnos"><div><small>RESERVAS</small><h2>{{ resumen.reservasConfirmadas + resumen.reservasPendientes + resumen.reservasCanceladas }}</h2></div><i class="bi bi-ticket-perforated-fill"></i></div>
        <div class="card buses"><div><small>VIAJES</small><h2>26</h2></div><i class="bi bi-bus-front-fill"></i></div>
        <div class="card reservas"><div><small>OCUPACIÓN</small><h2>8%</h2></div><i class="bi bi-people-fill"></i></div>
        <div class="card incidencias"><div><small>INCIDENCIAS</small><h2>{{ resumen.totalIncidencias }}</h2></div><i class="bi bi-exclamation-triangle-fill"></i></div>
      </section>

      <section class="charts">
        <div class="chart-card">
          <div class="card-header"><h3>Reservas por Día</h3><button (click)="irReservas()">Detalles</button></div>
          <canvas #reservasChart></canvas>
        </div>
        <div class="chart-card">
          <div class="card-header"><h3>Estado de la Flota</h3><button (click)="irTransporte()">Detalles</button></div>
          <canvas #flotaChart></canvas>
        </div>
      </section>

      <div class="panel" style="margin-top:20px;" *ngIf="resumen">
        <div class="panel-title"><h3><i class="bi bi-sign-turn-right-fill"></i> Resumen por Ruta</h3></div>
        <table>
          <thead><tr><th>Ruta</th><th>Reservas</th><th>Confirmadas</th><th>Pendientes</th><th>Canceladas</th></tr></thead>
          <tbody>
            <tr *ngFor="let ru of rutas">
              <td>{{ ru }}</td>
              <td>{{ conteo(ru) }}</td>
              <td>{{ resumen.reservasConfirmadas }}</td>
              <td>{{ resumen.reservasPendientes }}</td>
              <td>{{ resumen.reservasCanceladas }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class ReportesComponent implements AfterViewInit {
  private svc = inject(ReporteService);
  private router = inject(Router);
  resumen?: ReporteResumen;
  rutas = ['Norte', 'Sur', 'Centro'];
  @ViewChild('reservasChart') rc!: ElementRef<HTMLCanvasElement>;
  @ViewChild('flotaChart') fc!: ElementRef<HTMLCanvasElement>;

  constructor() { this.svc.resumen().subscribe(r => (this.resumen = r)); }

  conteo(ru: string) { return this.resumen?.reservasPorRuta?.[ru] ?? 0; }

  irReservas() { this.router.navigate(['/app/reservas']); }
  irTransporte() { this.router.navigate(['/app/transporte']); }
  imprimir() { window.print(); }

  exportarCSV() {
    if (!this.resumen) return;
    let csv = 'Ruta,Reservas,Confirmadas,Pendientes,Canceladas\n';
    this.rutas.forEach(ru => {
      csv += ru + ',' + this.conteo(ru) + ',' + this.resumen!.reservasConfirmadas + ',' + this.resumen!.reservasPendientes + ',' + this.resumen!.reservasCanceladas + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'reporte_rutasmart.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  ngAfterViewInit() {
    new Chart(this.rc.nativeElement, { type: 'line', data: { labels: ['Lun','Mar','Mié','Jue','Vie','Sáb'], datasets: [{ label: 'Reservas', data: [35,42,51,60,48,73], borderColor: '#155bc9', backgroundColor: 'rgba(21,91,201,.15)', fill: true, tension: .4 }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
    new Chart(this.fc.nativeElement, { type: 'doughnut', data: { labels: ['Operativos','En Ruta','Mantenimiento'], datasets: [{ data: [10,8,2], backgroundColor: ['#22c55e','#f59e0b','#ef4444'] }] }, options: { responsive: true } });
  }
}
