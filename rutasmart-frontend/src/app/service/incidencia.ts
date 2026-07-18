import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidencia } from '../models/incidencia';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/incidencias`;

  listar(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.API);
  }

  listarPorUsuario(idUsuario: number): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(`${this.API}/usuario/${idUsuario}`);
  }

  buscarPorId(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.API}/${id}`);
  }

  guardar(incidencia: Partial<Incidencia>): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.API, incidencia);
  }

  actualizar(id: number, incidencia: Partial<Incidencia>): Observable<Incidencia> {
    return this.http.put<Incidencia>(`${this.API}/${id}`, incidencia);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
