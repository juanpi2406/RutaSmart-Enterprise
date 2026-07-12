import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly KEY = 'usuario';
  private readonly esBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  guardar(usuario: any): void {

    if (!this.esBrowser) return;

    localStorage.setItem(
      this.KEY,
      JSON.stringify(usuario)
    );
  }

  obtener(): any {

    if (!this.esBrowser) return null;

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

  obtenerToken(): string | null {

    const usuario = this.obtener();

    if (!usuario) {
      return null;
    }

    return usuario.token ?? null;

  }

  estaLogueado(): boolean {

    return this.obtener() != null;

  }

  eliminar(): void {

    if (!this.esBrowser) return;

    localStorage.removeItem(this.KEY);

  }

}
