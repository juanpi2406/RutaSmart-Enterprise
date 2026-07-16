import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bus } from '../models/bus';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/buses`;

  listar(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.API);
  }

  buscarPorId(id: number): Observable<Bus> {
    return this.http.get<Bus>(`${this.API}/${id}`);
  }

  guardar(bus: Partial<Bus>): Observable<Bus> {
    return this.http.post<Bus>(this.API, bus);
  }

  actualizar(id: number, bus: Partial<Bus>): Observable<Bus> {
    return this.http.put<Bus>(`${this.API}/${id}`, bus);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
