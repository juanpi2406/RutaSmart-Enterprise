import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { SessionService } from '../service/session';
import { MENU } from '../config/menu';
import { MenuItem } from '../models/menu-item';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay';

@Component({
  selector: 'app-dashboard',
  standalone: true,
imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LoadingOverlayComponent
],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  private router = inject(Router);
  private session = inject(SessionService);

  usuario: any = null;

  nombreUsuario = '';

  rolUsuario = '';

  menu: MenuItem[] = [];

  currentTime = '';

  currentDate = '';

  private reloj: any;

  ngOnInit(): void {

    this.usuario = this.session.obtener();

    if (!this.usuario) {

      this.router.navigate(['/login']);

      return;

    }

    this.nombreUsuario = this.session.obtenerNombre();

    this.rolUsuario = this.session.obtenerRol();

    this.menu = MENU.filter(item =>
      item.roles.includes(this.rolUsuario)
    );

//setTimeout(() => {

  //this.actualizarFechaHora();

 // this.reloj = setInterval(() => {

   // this.actualizarFechaHora();

  //}, 1000);

//});

  }

  ngOnDestroy(): void {

    if (this.reloj) {

      clearInterval(this.reloj);

    }

  }

  actualizarFechaHora(): void {

    const ahora = new Date();

    this.currentTime = ahora.toLocaleTimeString('es-PE');

    this.currentDate = ahora.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  }

  logout(): void {

    this.session.eliminar();

    this.router.navigate(['/login']);

  }

}
