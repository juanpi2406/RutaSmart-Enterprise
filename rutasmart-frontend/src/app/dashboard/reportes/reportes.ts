import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../service/reserva';
import { IncidenciaService } from '../../service/incidencia';
import { BusService } from '../../service/bus';
import { Incidencia } from '../../models/incidencia';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html'
})
export class ReportesComponent implements OnInit {

  private reservaService = inject(ReservaService);
  private incidenciaService = inject(IncidenciaService);
  private busService = inject(BusService);

  totalReservas = 0;
  totalBuses = 0;
  busesActivos = 0;
  eficiencia = 0;
  ultimasIncidencias: Incidencia[] = [];

  ngOnInit(): void {

    this.reservaService.listar().subscribe({
      next: (data) => this.totalReservas = data.length,
      error: (err) => console.error(err)
    });

    this.busService.listar().subscribe({
      next: (data) => {
        this.totalBuses = data.length;
        this.busesActivos = data.filter(b => b.estado === true).length;
        this.eficiencia = this.totalBuses > 0
          ? Math.round((this.busesActivos / this.totalBuses) * 1000) / 10
          : 0;
      },
      error: (err) => console.error(err)
    });

    this.incidenciaService.listar().subscribe({
      next: (data) => {
        this.ultimasIncidencias = data
          .sort((a, b) => (b.fechaRegistro ?? '').localeCompare(a.fechaRegistro ?? ''))
          .slice(0, 5);
      },
      error: (err) => console.error(err)
    });

  }

  exportarPDF() {
    window.print();
  }

}
