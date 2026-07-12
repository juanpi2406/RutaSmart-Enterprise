import { Routes } from '@angular/router';
import { AuthGuard } from './app/guards/auth.guard';
import { LoginComponent } from './app/components/login/login.component';
import { ShellComponent } from './app/components/shell/shell.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { UsuariosComponent } from './app/components/usuarios/usuarios.component';
import { TransporteComponent } from './app/components/transporte/transporte.component';
import { ReservasComponent } from './app/components/reservas/reservas.component';
import { ReportesComponent } from './app/components/reportes/reportes.component';
import { ConfiguracionComponent } from './app/components/configuracion/configuracion.component';
import { ChoferComponent } from './app/components/chofer/chofer.component';
import { AlumnoComponent } from './app/components/alumno/alumno.component';
import { AlumnoReservasComponent } from './app/components/alumno-reservas/alumno-reservas.component';
import { AlumnoHistorialComponent } from './app/components/alumno-historial/alumno-historial.component';
import { AlumnoIncidenciasComponent } from './app/components/alumno-incidencias/alumno-incidencias.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'transporte', component: TransporteComponent },
      { path: 'reservas', component: ReservasComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'chofer', component: ChoferComponent },
      { path: 'alumno', component: AlumnoComponent },
      { path: 'alumno/reservas', component: AlumnoReservasComponent },
      { path: 'alumno/historial', component: AlumnoHistorialComponent },
      { path: 'alumno/incidencias', component: AlumnoIncidenciasComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
