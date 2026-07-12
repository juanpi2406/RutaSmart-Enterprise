import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { ChoferCreate, ChoferResponse, ChoferUpdate } from '../models/chofer';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/choferes';

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
