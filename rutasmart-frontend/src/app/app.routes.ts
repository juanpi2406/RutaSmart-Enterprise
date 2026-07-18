import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { DashboardHomeComponent } from './dashboard/home/home';

/* ======== MÓDULOS ADMINISTRACIÓN ======== */

import { UsuariosComponent } from './dashboard/usuarios/usuarios';
import { BusesComponent } from './dashboard/buses/buses';
import { RutasComponent } from './dashboard/rutas/rutas';
import { ProgramacionesComponent } from './dashboard/programaciones/programaciones';
import { ViajesComponent } from './dashboard/viajes/viajes';
import { ReservasComponent } from './dashboard/reservas/reservas';
import { IncidenciasComponent } from './dashboard/incidencias/incidencias';
import { ReportesComponent } from './dashboard/reportes/reportes';
import { ConfiguracionComponent } from './dashboard/configuracion/configuracion';

/* ======== MÓDULOS CHOFER ======== */

import { MiRutaComponent } from './dashboard/mi-ruta/mi-ruta';
import { MiProgramacionComponent } from './dashboard/mi-programacion/mi-programacion';

/* ======== MÓDULOS ALUMNO ======== */

import { ReservarComponent } from './dashboard/reservar/reservar';
import { MisReservasComponent } from './dashboard/mis-reservas/mis-reservas';
import { NotificacionesComponent } from './dashboard/notificaciones/notificaciones';

/* ======== COMPARTIDOS ALUMNO/CHOFER ======== */

import { PerfilComponent } from './dashboard/perfil/perfil';

/* ======== GUARDS ======== */

import { authGuard } from './guards/auth.guard';
import { rolGuard } from './guards/rol.guard';

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
    canActivate: [authGuard],

    children: [

      // =============================
      // HOME
      // =============================

      {
        path: '',
        component: DashboardHomeComponent
      },

      // =============================
      // ADMINISTRACIÓN (solo ADMINISTRADOR)
      // =============================

      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      {
        path: 'alumnos',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      },

      {
        path: 'choferes',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      },

      {
        path: 'paraderos',
        redirectTo: 'rutas',
        pathMatch: 'full'
      },

      {
        path: 'buses',
        component: BusesComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      {
        path: 'rutas',
        component: RutasComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      {
        path: 'programaciones',
        component: ProgramacionesComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      {
        path: 'viajes',
        component: ViajesComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      // =============================
      // RESERVAS (ADMINISTRADOR + ALUMNO)
      // =============================

      {
        path: 'reservas',
        component: ReservasComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      // =============================
      // INCIDENCIAS (ADMINISTRADOR + CHOFER)
      // =============================

      {
        path: 'incidencias',
        component: IncidenciasComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR', 'CHOFER', 'ALUMNO'] }
      },

      {
        path: 'reportar-incidencia',
        component: IncidenciasComponent,
        canActivate: [rolGuard],
        data: { roles: ['CHOFER', 'ALUMNO'] }
      },

      // =============================
      // CHOFER
      // =============================

      {
        path: 'mi-ruta',
        component: MiRutaComponent,
        canActivate: [rolGuard],
        data: { roles: ['CHOFER'] }
      },

      {
        path: 'mi-programacion',
        component: MiProgramacionComponent,
        canActivate: [rolGuard],
        data: { roles: ['CHOFER'] }
      },

      // =============================
      // ALUMNO
      // =============================

      {
        path: 'reservar',
        component: ReservarComponent,
        canActivate: [rolGuard],
        data: { roles: ['ALUMNO'] }
      },

      {
        path: 'mis-reservas',
        component: MisReservasComponent,
        canActivate: [rolGuard],
        data: { roles: ['ALUMNO'] }
      },

      {
        path: 'notificaciones',
        component: NotificacionesComponent,
        canActivate: [rolGuard],
        data: { roles: ['CHOFER'] }
      },

      // =============================
      // COMPARTIDO ALUMNO/CHOFER
      // =============================

      {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR', 'ALUMNO', 'CHOFER'] }
      },

      // =============================
      // REPORTES Y CONFIGURACIÓN (solo ADMINISTRADOR)
      // =============================

      {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },

      {
        path: 'configuracion',
        component: ConfiguracionComponent,
        canActivate: [rolGuard],
        data: { roles: ['ADMINISTRADOR'] }
      }

    ]

  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
