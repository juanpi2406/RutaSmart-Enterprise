import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';

export interface Rol {

  idRol: number;

  nombre: string;

}

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);

  private readonly API = 'https://tu-dominio-de-railway.up.railway.app/api/roles';

  listar(): Observable<ApiResponse<Rol[]>> {

    return this.http.get<ApiResponse<Rol[]>>(this.API);

  }

  buscarPorId(id:number):Observable<ApiResponse<Rol>>{

    return this.http.get<ApiResponse<Rol>>(
      `${this.API}/${id}`
    );

  }

}
