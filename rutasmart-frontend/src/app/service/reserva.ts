import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/reservas';

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.API);
  }

  listarPorAlumno(idAlumno: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.API}/alumno/${idAlumno}`);
  }

  listarPorViaje(idViaje: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.API}/viaje/${idViaje}`);
  }

  buscarPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.API}/${id}`);
  }

  guardar(reserva: Partial<Reserva>): Observable<Reserva> {
    return this.http.post<Reserva>(this.API, reserva);
  }

  actualizar(id: number, reserva: Partial<Reserva>): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.API}/${id}`, reserva);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
