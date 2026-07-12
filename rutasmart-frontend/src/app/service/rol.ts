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

  private readonly API = 'http://localhost:8080/api/roles';

  listar(): Observable<ApiResponse<Rol[]>> {

    return this.http.get<ApiResponse<Rol[]>>(this.API);

  }

  buscarPorId(id:number):Observable<ApiResponse<Rol>>{

    return this.http.get<ApiResponse<Rol>>(
      `${this.API}/${id}`
    );

  }

}
