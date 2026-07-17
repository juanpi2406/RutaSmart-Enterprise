import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionService } from '../../service/session';
import { DashboardService } from '../../service/dashboard';
import { ChangeDetectorRef } from '@angular/core';

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

  /*=========================================
   * SERVICIOS
   =========================================*/

  private session = inject(SessionService);

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  /*=========================================
   * SESIÓN
   =========================================*/

  usuario: any;

  nombre = '';

  rol = '';

  fecha = '';

  /*=========================================
   * DASHBOARD ADMINISTRADOR
   =========================================*/

  totalUsuarios = 0;

  totalAlumnos = 0;

  totalChoferes = 0;

  totalBuses = 0;

  totalReservas = 0;

  totalIncidencias = 0;

  viajesActivos = 0;

  busesOperativos = 0;

  busesEnRuta = 0;

  busesMantenimiento = 0;

  /*=========================================
   * DASHBOARD ALUMNO
   =========================================*/

  proximoViaje = '';

  estadoBus = '';

  misReservas = 0;

  misNotificaciones = 0;

  ruta = '';

  paradero = '';

  horaLlegadaBus = '';

  /*=========================================
   * DASHBOARD CHOFER
   =========================================*/

  busAsignado = '';

  estadoViaje = '';

  pasajeros = 0;

  incidenciasHoy = 0;

  horaSalida = '';

  horaLlegada = '';

  asientosDisponibles = 0;

  /*=========================================
   * CHART
   =========================================*/

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

    switch (this.rol) {

      case 'ADMINISTRADOR':

        this.cargarDashboardAdmin();

        break;

      case 'ALUMNO':

        this.cargarDashboardAlumno();

        break;

      case 'CHOFER':

        this.cargarDashboardChofer();

        break;

    }

  }





/*=========================================
 * DASHBOARD ADMINISTRADOR
 =========================================*/

cargarDashboardAdmin(): void {

  this.dashboardService
      .dashboardAdmin()
      .subscribe({

        next: (data) => {

          this.totalUsuarios = data.totalUsuarios;

          this.totalAlumnos = data.totalAlumnos;

          this.totalChoferes = data.totalChoferes;

          this.totalBuses = data.totalBuses;

          this.totalReservas = data.totalReservas;

          this.totalIncidencias = data.incidenciasPendientes;

          this.viajesActivos = data.viajesActivos;

          /*
           * Estos indicadores aún no son enviados
           * por el backend.
           * Los dejamos preparados para una
           * siguiente versión.
           */

          this.busesOperativos = data.totalBuses;

          this.busesEnRuta = data.viajesActivos;

          this.busesMantenimiento =
              Math.max(
                  0,
                  data.totalBuses - data.viajesActivos
              );
              this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error cargando Dashboard Administrador',
            error
          );

        }

      });

}

  /*=========================================
 * DASHBOARD ALUMNO
 =========================================*/


cargarDashboardAlumno(): void {

  if (!this.usuario?.idUsuario) {

    console.error('No existe un usuario en sesión.');

    return;

  }

  this.dashboardService
      .dashboardAlumno(this.usuario.idUsuario)
      .subscribe({

        next: (data) => {

          this.proximoViaje = data.proximoViaje;

          this.estadoBus = data.estadoBus;

          this.misReservas = data.misReservas;

          this.misNotificaciones = data.notificaciones;

          this.ruta = data.ruta;

          this.paradero = data.paradero;

          this.horaLlegadaBus = data.horaLlegadaBus;

          this.cdr.detectChanges();
        },


        error: (error) => {

          console.error(
            'Error cargando Dashboard Alumno',
            error
          );

        }

      });

}

/*=========================================
 * DASHBOARD CHOFER
 =========================================*/

cargarDashboardChofer(): void {

  if (!this.usuario?.idUsuario) {

    console.error('No existe un usuario en sesión.');

    return;

  }

  this.dashboardService
      .dashboardChofer(this.usuario.idUsuario)
      .subscribe({

        next: (data) => {

          this.busAsignado = data.busAsignado;

          this.estadoViaje = data.estadoViaje;

          this.pasajeros = data.pasajeros;

          this.incidenciasHoy = data.incidenciasHoy;

          this.horaSalida = data.horaSalida;

          this.horaLlegada = data.horaLlegada;

          this.asientosDisponibles = data.asientosDisponibles;
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error cargando Dashboard Chofer',
            error
          );

        }

      });

}

}
