import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UbicacionBus } from '../models/ubicacion-bus';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class UbicacionBusService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/ubicaciones`;

  listar(): Observable<UbicacionBus[]> {
    return this.http.get<UbicacionBus[]>(this.API);
  }

  listarActivas(): Observable<UbicacionBus[]> {
    return this.http.get<UbicacionBus[]>(`${this.API}/activas`);
  }

  ultimaPorViaje(idViaje: number): Observable<UbicacionBus> {
    return this.http.get<UbicacionBus>(`${this.API}/viaje/${idViaje}/ultima`);
  }

  guardar(ubicacion: Partial<UbicacionBus>): Observable<UbicacionBus> {
    return this.http.post<UbicacionBus>(this.API, ubicacion);
  }

  actualizar(id: number, ubicacion: Partial<UbicacionBus>): Observable<UbicacionBus> {
    return this.http.put<UbicacionBus>(`${this.API}/${id}`, ubicacion);
  }
}
