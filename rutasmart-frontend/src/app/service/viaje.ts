import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Viaje } from '../models/viaje';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/viajes`;

  listar(): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(this.API);
  }

  listarPorRutaYFecha(idRuta: number, fechaViaje: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.API}/buscar`, {
      params: {
        ruta: idRuta.toString(),
        fechaViaje: fechaViaje
      }
    });
  }

  buscarPorId(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.API}/${id}`);
  }

  guardar(viaje: Partial<Viaje>): Observable<Viaje> {
    return this.http.post<Viaje>(this.API, viaje);
  }

  actualizar(id: number, viaje: Partial<Viaje>): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.API}/${id}`, viaje);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
