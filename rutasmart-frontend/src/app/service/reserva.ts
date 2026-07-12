import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'URL_DE_TU_BACKEND/api/reservas'; // Reemplaza con tu endpoint real

  constructor(private http: HttpClient) {}

  obtenerReservasActivas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/activas`);
  }

  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial`);
  }

  crearReserva(reservaData: { ruta: string; hora: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reservaData);
  }

  cancelarReserva(ruta: string, hora: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}`, { body: { ruta, hora } });
  }
}