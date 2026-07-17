import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { API_BASE_URL } from '../config/api.config';

export interface Rol {

  idRol: number;

  nombre: string;

}

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);

  private readonly API = `${API_BASE_URL}/api/roles`;

  listar(): Observable<ApiResponse<Rol[]>> {

    return this.http.get<ApiResponse<Rol[]>>(this.API);

  }

  buscarPorId(id:number):Observable<ApiResponse<Rol>>{

    return this.http.get<ApiResponse<Rol>>(
      `${this.API}/${id}`
    );

  }

}
