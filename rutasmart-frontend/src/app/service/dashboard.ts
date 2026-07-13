import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardAdmin } from '../models/dashboardAdmin';
import { DashboardAlumno } from '../models/dashboardAlumno';
import { DashboardChofer } from '../models/dashboardChofer';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private readonly API = 'http://localhost:8080/api/dashboard';

  /*=========================================
   * ADMINISTRADOR
   =========================================*/

dashboardAdmin(): Observable<DashboardAdmin> {

  return this.http.get<DashboardAdmin>(`${this.API}/admin`);

}

  /*=========================================
   * ALUMNO
   =========================================*/

dashboardAlumno(idUsuario: number): Observable<DashboardAlumno> {

  return this.http.get<DashboardAlumno>(
    `${this.API}/alumno/${idUsuario}`
  );

}

  /*=========================================
   * CHOFER
   =========================================*/

dashboardChofer(idUsuario: number): Observable<DashboardChofer> {

  return this.http.get<DashboardChofer>(
      `${this.API}/chofer/${idUsuario}`
  );

}

}
