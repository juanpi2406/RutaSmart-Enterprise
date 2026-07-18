import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ReservaService } from '../../service/reserva';
import { IncidenciaService } from '../../service/incidencia';
import { BusService } from '../../service/bus';
import { Incidencia } from '../../models/incidencia';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrls: ['../incidencias/incidencias.css', './reportes.css']
})
export class ReportesComponent implements OnInit {

  private reservaService = inject(ReservaService);
  private incidenciaService = inject(IncidenciaService);
  private busService = inject(BusService);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  totalReservas = 0;
  totalBuses = 0;
  busesActivos = 0;
  eficiencia = 0;
  ultimasIncidencias: Incidencia[] = [];

  ngOnInit(): void {
    forkJoin({
      reservas: this.reservaService.listar(),
      buses: this.busService.listar(),
      incidencias: this.incidenciaService.listar()
    }).subscribe({
      next: ({ reservas, buses, incidencias }) => {
        this.totalReservas = reservas.length;
        this.totalBuses = buses.length;
        this.busesActivos = buses.filter(b => b.estado === true).length;
        this.eficiencia = this.totalBuses > 0
          ? Math.round((this.busesActivos / this.totalBuses) * 1000) / 10
          : 0;
        this.ultimasIncidencias = incidencias
          .sort((a, b) => (b.fechaRegistro ?? '').localeCompare(a.fechaRegistro ?? ''))
          .slice(0, 8);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  exportarPDF(): void {
    window.print();
  }

}
