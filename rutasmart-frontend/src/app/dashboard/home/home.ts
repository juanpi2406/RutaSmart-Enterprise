import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionService } from '../../service/session';
import { DashboardService } from '../../service/dashboard';
import { ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { NgZone } from '@angular/core';
import { BusTrackingService } from '../../service/bus-tracking.service';





@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {

  /*=========================================
   * SERVICIOS
   =========================================*/

  private session = inject(SessionService);

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

private zone = inject(NgZone);
private trackingBus = inject(BusTrackingService);
private simulacion?: Subscription;
private seguimiento?: Subscription;
/*=========================================
SIMULACIÓN
=========================================*/

viajeIniciado = false;
ultimaActualizacion = 0;

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
POSICIÓN DEL BUS
=========================================*/

busLeft = 62;

busTop = 39;

/*=========================================
RUTA DEL BUS
=========================================*/

private rutaBus = [

  { left: 72, top: 84 },
  { left: 70, top: 76 },
  { left: 68, top: 69 },
  { left: 66, top: 60 },
  { left: 64, top: 52 },
  { left: 61, top: 44 },
  { left: 57, top: 36 },
  { left: 52, top: 30 },
  { left: 46, top: 25 },
  { left: 40, top: 22 }

];

private indiceRuta = 0;


iniciarViaje(): void {

    if (this.viajeIniciado) {
        return;
    }

    this.viajeIniciado = true;

    this.estadoViaje = 'EN RUTA';

    this.iniciarSimulacion();

}



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



    this.seguimiento = this.trackingBus.posicion$.subscribe((posicion) => {
      this.busLeft = posicion.left;
      this.busTop = posicion.top;
      this.ultimaActualizacion = posicion.actualizadoEn;
      if (this.rol !== 'CHOFER') this.viajeIniciado = posicion.activo;
      this.cdr.detectChanges();
    });

  }

  ngOnDestroy(): void {
    this.simulacion?.unsubscribe();
    this.seguimiento?.unsubscribe();
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

private avanzando = true;

private iniciarSimulacion(): void {

    this.simulacion?.unsubscribe();
    this.indiceRuta = 0;
    this.avanzando = true;

    this.busLeft = this.rutaBus[0].left;
    this.busTop = this.rutaBus[0].top;
    this.trackingBus.publicar(this.busLeft, this.busTop);

    this.simulacion = interval(3000).subscribe(() => {

        if (this.avanzando) {

            this.indiceRuta++;

            if (this.indiceRuta >= this.rutaBus.length - 1) {

                this.indiceRuta = this.rutaBus.length - 1;

                this.avanzando = false;

            }

        } else {

            this.indiceRuta--;

            if (this.indiceRuta <= 0) {

                this.indiceRuta = 0;

                this.avanzando = true;

            }

        }

        this.busLeft = this.rutaBus[this.indiceRuta].left;
        this.busTop = this.rutaBus[this.indiceRuta].top;
        this.trackingBus.publicar(this.busLeft, this.busTop);
        this.cdr.detectChanges();
    });



}

}
