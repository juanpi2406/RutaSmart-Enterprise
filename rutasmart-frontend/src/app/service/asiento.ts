import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asiento } from '../models/asiento';

export type { Asiento } from '../models/asiento';

@Injectable({
  providedIn: 'root'
})
export class AsientoService {
  private http = inject(HttpClient);
  private readonly API = 'https://tu-dominio-de-railway.up.railway.app/api/asientos';

  listarPorViaje(idViaje: number): Observable<Asiento[]> {
    return this.http.get<Asiento[]>(`${this.API}/viaje/${idViaje}`);
  }

  guardar(asiento: Partial<Asiento>): Observable<Asiento> {
    return this.http.post<Asiento>(this.API, asiento);
  }

  actualizar(id: number, asiento: Partial<Asiento>): Observable<Asiento> {
    return this.http.put<Asiento>(`${this.API}/${id}`, asiento);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
