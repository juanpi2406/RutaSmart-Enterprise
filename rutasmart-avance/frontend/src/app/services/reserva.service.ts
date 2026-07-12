import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private base = '/api/reservas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.base);
  }

  crear(r: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.base, r);
  }

  actualizar(id: number, r: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.base}/${id}`, r);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
