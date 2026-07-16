import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { ChoferCreate, ChoferResponse, ChoferUpdate } from '../models/chofer';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private http = inject(HttpClient);
  private readonly API = `${API_BASE_URL}/api/choferes`;

  listar(): Observable<ApiResponse<ChoferResponse[]>> {
    return this.http.get<ApiResponse<ChoferResponse[]>>(this.API);
  }

  obtenerPorId(id: number): Observable<ApiResponse<ChoferResponse>> {
    return this.http.get<ApiResponse<ChoferResponse>>(`${this.API}/${id}`);
  }

  crear(dto: ChoferCreate): Observable<ApiResponse<ChoferResponse>> {
    return this.http.post<ApiResponse<ChoferResponse>>(this.API, dto);
  }

  actualizar(id: number, dto: ChoferUpdate): Observable<ApiResponse<ChoferResponse>> {
    return this.http.put<ApiResponse<ChoferResponse>>(`${this.API}/${id}`, dto);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API}/${id}`);
  }
}
