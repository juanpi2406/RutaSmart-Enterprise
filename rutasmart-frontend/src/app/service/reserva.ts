import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/reservas`;

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

  obtenerCapacidad(idViaje: number): Observable<{ idViaje: number; capacidad: number; ocupados: number; disponibles: number }> {
    return this.http.get<{ idViaje: number; capacidad: number; ocupados: number; disponibles: number }>(
      `${this.API}/viaje/${idViaje}/capacidad`
    );
  }

  validarQr(codigo: string, idViaje: number): Observable<{ valido: boolean; mensaje: string; reserva?: Reserva }> {
    return this.http.post<{ valido: boolean; mensaje: string; reserva?: Reserva }>(
      `${this.API}/validar-qr?codigo=${encodeURIComponent(codigo)}&idViaje=${idViaje}`,
      {}
    );
  }
}
