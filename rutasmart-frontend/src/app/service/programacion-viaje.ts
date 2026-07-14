import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramacionViaje } from '../models/programacion-viaje';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionViajeService {
  private http = inject(HttpClient);
  private readonly API = 'https://tu-dominio-de-railway.up.railway.app/api/programaciones';

  listar(): Observable<ProgramacionViaje[]> {
    return this.http.get<ProgramacionViaje[]>(this.API);
  }

  buscarPorId(id: number): Observable<ProgramacionViaje> {
    return this.http.get<ProgramacionViaje>(`${this.API}/${id}`);
  }

  guardar(programacion: Partial<ProgramacionViaje>): Observable<ProgramacionViaje> {
    return this.http.post<ProgramacionViaje>(this.API, programacion);
  }

  actualizar(id: number, programacion: Partial<ProgramacionViaje>): Observable<ProgramacionViaje> {
    return this.http.put<ProgramacionViaje>(`${this.API}/${id}`, programacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
