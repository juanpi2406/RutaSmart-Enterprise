import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/usuario';

export interface Asiento {
    idAsiento: number;
    idViaje: number;
    numeroAsiento: number;
    estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AsientoService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/asientos';

  listarPorViaje(idViaje: number): Observable<Asiento[]> {
    return this.http.get<Asiento[]>(`${this.API}/viaje/${idViaje}`);
  }
}
