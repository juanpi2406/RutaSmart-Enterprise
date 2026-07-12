import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidencia } from '../models/incidencia';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/incidencias';

  listar(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.API);
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
