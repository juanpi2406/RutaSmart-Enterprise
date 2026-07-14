import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../models/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private readonly API = 'https://tu-dominio-de-railway.up.railway.app/api/notificaciones';

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.API);
  }

  buscarPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.API}/${id}`);
  }

  guardar(notificacion: Partial<Notificacion>): Observable<Notificacion> {
    return this.http.post<Notificacion>(this.API, notificacion);
  }

  actualizar(id: number, notificacion: Partial<Notificacion>): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.API}/${id}`, notificacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
