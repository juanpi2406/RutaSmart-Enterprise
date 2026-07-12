import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incidencia } from '../models';

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  private base = '/api/incidencias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.base);
  }

  crear(i: Incidencia): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.base, i);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
