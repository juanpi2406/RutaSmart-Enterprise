import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface EtaInfo {
  idViaje?: number;
  idParadero?: number;
  minutosEstimados?: number;
  paradasRestantes?: number;
  distanciaMetros?: number;
  mensaje?: string;
}

@Injectable({ providedIn: 'root' })
export class EtaService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/eta`;

  calcular(idViaje: number, idParadero: number): Observable<EtaInfo> {
    return this.http.get<EtaInfo>(`${this.API}/viaje/${idViaje}/paradero/${idParadero}`);
  }
}
