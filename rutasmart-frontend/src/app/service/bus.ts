import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bus } from '../models/bus';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/api/buses';

  listar(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.API);
  }

  buscarPorId(id: number): Observable<Bus> {
    return this.http.get<Bus>(`${this.API}/${id}`);
  }
}
