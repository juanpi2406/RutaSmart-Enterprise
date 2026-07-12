import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionService } from '../../service/session';
import { UsuarioService } from '../../service/usuario';
import { AlumnoService } from '../../service/alumno';
import { BusService } from '../../service/bus';
import { ReservaService } from '../../service/reserva';
import { IncidenciaService } from '../../service/incidencia';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class DashboardHomeComponent implements OnInit {

  private session = inject(SessionService);
  private usuarioService = inject(UsuarioService);
  private alumnoService = inject(AlumnoService);
  private busService = inject(BusService);
  private reservaService = inject(ReservaService);
  private incidenciaService = inject(IncidenciaService);

  usuario: any;

  nombre = '';

  rol = '';

  fecha = '';

  // ==========================
  // KPIs
  // ==========================

  totalUsuarios = 0;

  totalAlumnos = 0;

  totalBuses = 0;

  totalReservas = 0;

  totalIncidencias = 0;

  // ==========================
  // Estado Flota
  // ==========================
  // Nota: BusDTO solo tiene un booleano "estado" (activo/inactivo),
  // no hay un estado operativo de 3 valores en el backend.
  // busesEnRuta / busesMantenimiento quedan en 0 (dato no disponible).

  busesOperativos = 0;

  busesEnRuta = 0;

  busesMantenimiento = 0;

  // ==========================
  // Chart.js
  // ==========================

  reservasPorDia: any[] = [];

  ngOnInit(): void {

    this.usuario = this.session.obtener();

    this.nombre = this.session.obtenerNombre();

    this.rol = this.session.obtenerRol();

    this.fecha = new Date().toLocaleDateString(
      'es-PE',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );

    if (this.rol === 'ADMINISTRADOR') {
      this.cargarDashboard();
    }

  }

  cargarDashboard(): void {

    this.usuarioService.listar().subscribe({
      next: (respuesta) => this.totalUsuarios = respuesta.data.length,
      error: (err) => console.error(err)
    });

    this.alumnoService.listar().subscribe({
      next: (data) => this.totalAlumnos = data.length,
      error: (err) => console.error(err)
    });

    this.busService.listar().subscribe({
      next: (data) => {
        this.totalBuses = data.length;
        this.busesOperativos = data.filter(b => b.estado === true).length;
      },
      error: (err) => console.error(err)
    });

    this.reservaService.listar().subscribe({
      next: (data) => this.totalReservas = data.length,
      error: (err) => console.error(err)
    });

    this.incidenciaService.listar().subscribe({
      next: (data) => this.totalIncidencias = data.length,
      error: (err) => console.error(err)
    });

  }

}
