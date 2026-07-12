import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bus } from '../models';

@Injectable({ providedIn: 'root' })
export class BusService {
  private base = '/api/buses';

  constructor(private http: HttpClient) {}

  listar(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.base);
  }

  crear(b: Bus): Observable<Bus> {
    return this.http.post<Bus>(this.base, b);
  }

  actualizar(id: number, b: Bus): Observable<Bus> {
    return this.http.put<Bus>(`${this.base}/${id}`, b);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
