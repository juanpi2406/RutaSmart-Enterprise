import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionProgramacion } from '../models/asignacion-programacion';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AsignacionProgramacionService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/asignaciones`;

  listar(): Observable<AsignacionProgramacion[]> {
    return this.http.get<AsignacionProgramacion[]>(this.API);
  }

  buscarPorId(id: number): Observable<AsignacionProgramacion> {
    return this.http.get<AsignacionProgramacion>(`${this.API}/${id}`);
  }

  guardar(asignacion: Partial<AsignacionProgramacion>): Observable<AsignacionProgramacion> {
    return this.http.post<AsignacionProgramacion>(this.API, asignacion);
  }

  actualizar(id: number, asignacion: Partial<AsignacionProgramacion>): Observable<AsignacionProgramacion> {
    return this.http.put<AsignacionProgramacion>(`${this.API}/${id}`, asignacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
