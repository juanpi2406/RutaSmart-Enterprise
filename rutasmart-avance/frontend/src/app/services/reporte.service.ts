import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardKpis, ReporteResumen } from '../models';

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private base = '/api';

  constructor(private http: HttpClient) {}

  dashboard(): Observable<DashboardKpis> {
    return this.http.get<DashboardKpis>(`${this.base}/dashboard/kpis`);
  }

  resumen(): Observable<ReporteResumen> {
    return this.http.get<ReporteResumen>(`${this.base}/reportes/resumen`);
  }
}
