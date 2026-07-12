import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly KEY = 'usuario';

  guardar(usuario: any): void {
    localStorage.setItem(
      this.KEY,
      JSON.stringify(usuario)
    );
  }

  obtener(): any {

    const datos = localStorage.getItem(this.KEY);

    if (!datos) {
      return null;
    }

    return JSON.parse(datos);

  }

  obtenerNombre(): string {

    const usuario = this.obtener();

    if (!usuario) {
      return '';
    }

    return usuario.nombres + ' ' + usuario.apellidos;

  }

  obtenerRol(): string {

    const usuario = this.obtener();

    if (!usuario) {
      return '';
    }

    return usuario.rol;

  }

  estaLogueado(): boolean {

    return this.obtener() != null;

  }

  eliminar(): void {

    localStorage.removeItem(this.KEY);

  }

}
