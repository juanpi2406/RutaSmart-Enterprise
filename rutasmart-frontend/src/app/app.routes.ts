import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { DashboardHomeComponent } from './dashboard/home/home';

/* ======== MÓDULOS EXISTENTES ======== */

import { UsuariosComponent } from './dashboard/usuarios/usuarios';
import { TransporteComponent } from './dashboard/transporte/transporte';
import { ReservasComponent } from './dashboard/reservas/reservas';
import { ReportesComponent } from './dashboard/reportes/reportes';

/* ======== MÓDULOS FUTUROS ======== */

/*
import { AlumnosComponent } from './dashboard/alumnos/alumnos';
import { ChoferesComponent } from './dashboard/choferes/choferes';
import { BusesComponent } from './dashboard/buses/buses';
import { RutasComponent } from './dashboard/rutas/rutas';
import { ParaderosComponent } from './dashboard/paraderos/paraderos';
import { ViajesComponent } from './dashboard/viajes/viajes';
import { ProgramacionesComponent } from './dashboard/programaciones/programaciones';
import { IncidenciasComponent } from './dashboard/incidencias/incidencias';
import { PerfilComponent } from './dashboard/perfil/perfil';
import { MisReservasComponent } from './dashboard/mis-reservas/mis-reservas';
import { ReservarComponent } from './dashboard/reservar/reservar';
import { MiRutaComponent } from './dashboard/mi-ruta/mi-ruta';
import { ConfiguracionComponent } from './dashboard/configuracion/configuracion';
*/

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent,

    children: [

      // =============================
      // HOME
      // =============================

      {
        path: '',
        component: DashboardHomeComponent
      },

      // =============================
      // YA IMPLEMENTADOS
      // =============================

      {
        path: 'usuarios',
        component: UsuariosComponent
      },

      {
        path: 'transporte',
        component: TransporteComponent
      },

      {
        path: 'reservas',
        component: ReservasComponent
      },

      {
        path: 'reportes',
        component: ReportesComponent
      },

      // =============================
      // SIGUIENTES MÓDULOS
      // (Descomentar cuando existan)
      // =============================

      /*
      {
        path:'alumnos',
        component:AlumnosComponent
      },

      {
        path:'choferes',
        component:ChoferesComponent
      },

      {
        path:'buses',
        component:BusesComponent
      },

      {
        path:'rutas',
        component:RutasComponent
      },

      {
        path:'paraderos',
        component:ParaderosComponent
      },

      {
        path:'programaciones',
        component:ProgramacionesComponent
      },

      {
        path:'viajes',
        component:ViajesComponent
      },

      {
        path:'incidencias',
        component:IncidenciasComponent
      },

      {
        path:'perfil',
        component:PerfilComponent
      },

      {
        path:'mis-reservas',
        component:MisReservasComponent
      },

      {
        path:'reservar',
        component:ReservarComponent
      },

      {
        path:'mi-ruta',
        component:MiRutaComponent
      },

      {
        path:'configuracion',
        component:ConfiguracionComponent
      }
      */

    ]

  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
