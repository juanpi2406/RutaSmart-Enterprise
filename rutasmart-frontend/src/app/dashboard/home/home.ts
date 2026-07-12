import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionService } from '../../service/session';

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

  busesOperativos = 0;

  busesEnRuta = 0;

  busesMantenimiento = 0;

  // ==========================
  // Chart.js
  // ==========================

  reservasPorDia: any[] = [];

  constructor(){}

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

    this.cargarDashboard();

  }

  cargarDashboard(): void {

    // ==========
    // TEMPORAL
    // ==========
    // Luego serán reemplazados
    // por llamadas HTTP.

    this.totalUsuarios = 68;

    this.totalAlumnos = 45;

    this.totalBuses = 12;

    this.totalReservas = 231;

    this.totalIncidencias = 3;

    this.busesOperativos = 9;

    this.busesEnRuta = 2;

    this.busesMantenimiento = 1;

    this.reservasPorDia = [

      {
        dia: 'Lun',
        reservas: 34
      },

      {
        dia: 'Mar',
        reservas: 48
      },

      {
        dia: 'Mié',
        reservas: 55
      },

      {
        dia: 'Jue',
        reservas: 61
      },

      {
        dia: 'Vie',
        reservas: 74
      },

      {
        dia: 'Sáb',
        reservas: 82
      }

    ];

  }

  // ==========================
  // FUTURAS LLAMADAS
  // ==========================

  /*
  cargarUsuarios(){

      this.usuarioService.listar()
      .subscribe(...);

  }

  cargarAlumnos(){

      this.alumnoService.listar()
      .subscribe(...);

  }

  cargarBuses(){

      this.busService.listar()
      .subscribe(...);

  }

  cargarReservas(){

      this.reservaService.listar()
      .subscribe(...);

  }

  cargarIncidencias(){

      this.incidenciaService.listar()
      .subscribe(...);

  }
  */

}
