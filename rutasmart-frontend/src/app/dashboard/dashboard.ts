import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { SessionService } from '../service/session';
import { NotificacionService } from '../service/notificacion';
import { DashboardService } from '../service/dashboard';
import { AlumnoService } from '../service/alumno';
import { MENU } from '../config/menu';
import { MenuItem } from '../models/menu-item';
import { Notificacion } from '../models/notificacion';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { OnboardingTourComponent } from '../components/onboarding-tour/onboarding-tour';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    OnboardingTourComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private router = inject(Router);
  private session = inject(SessionService);
  private notificacionService = inject(NotificacionService);
  private dashboardService = inject(DashboardService);
  private alumnoService = inject(AlumnoService);

  /** Expuesto al template para atajos de búsqueda. */
  readonly nav = this.router;

  usuario: any = null;
  nombreUsuario = '';
  rolUsuario = '';
  iniciales = '';
  menu: MenuItem[] = [];
  currentTime = '';
  currentDate = '';
  tituloPagina = 'Dashboard';

  notificacionesNoLeidas = 0;
  incidenciasBadge = 0;
  panelNotificacionesAbierto = false;
  panelMensajesAbierto = false;
  notificacionesRecientes: Notificacion[] = [];
  sidebarColapsado = false;
  sidebarAbierto = false;

  private reloj: any;
  private pollSub?: Subscription;

  ngOnInit(): void {
    this.usuario = this.session.obtener();

    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.nombreUsuario = this.session.obtenerNombre();
    this.iniciales = this.obtenerIniciales(this.nombreUsuario);

    const rolActual = (this.session.obtenerRol() ?? '')
      .toString()
      .trim()
      .toUpperCase();

    this.rolUsuario = rolActual;

    this.menu = MENU
      .filter(item =>
        item.roles.some(rol =>
          rol.toString().trim().toUpperCase() === rolActual
        )
      )
      .filter(item =>
        item.ruta !== '/dashboard/reportes' || rolActual === 'ADMINISTRADOR'
      );

    this.actualizarFechaHora();
    this.reloj = setInterval(() => this.actualizarFechaHora(), 1000);

    this.cargarBadges();
    this.pollSub = interval(20000).subscribe(() => this.cargarBadges());

    this.router.events.subscribe(() => {
      const url = this.router.url;
      const item = this.menu.find(m => m.ruta === url);
      this.tituloPagina = item?.titulo ?? 'Dashboard';
    });

    if (rolActual === 'ALUMNO' && sessionStorage.getItem('rutasmart-mostrar-sancion') === '1') {
      sessionStorage.removeItem('rutasmart-mostrar-sancion');
      this.mostrarModalSancionAlumno();
    }
  }

  ngOnDestroy(): void {
    if (this.reloj) clearInterval(this.reloj);
    this.pollSub?.unsubscribe();
  }

  @HostListener('document:click')
  cerrarPaneles(): void {
    this.panelNotificacionesAbierto = false;
    this.panelMensajesAbierto = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 900) {
      this.sidebarAbierto = false;
      document.body.classList.remove('nav-open');
    }
  }

  toggleSidebar(event: Event): void {
    event.stopPropagation();
    if (window.innerWidth <= 900) {
      this.sidebarAbierto = !this.sidebarAbierto;
    } else {
      this.sidebarColapsado = !this.sidebarColapsado;
    }
    document.body.classList.toggle('sidebar-collapsed', this.sidebarColapsado);
    document.body.classList.toggle('nav-open', this.sidebarAbierto);
  }

  cerrarSidebarMobile(): void {
    if (window.innerWidth <= 900) {
      this.sidebarAbierto = false;
      document.body.classList.remove('nav-open');
    }
  }

  toggleNotificaciones(event: Event): void {
    event.stopPropagation();
    this.panelMensajesAbierto = false;
    this.panelNotificacionesAbierto = !this.panelNotificacionesAbierto;
    if (this.panelNotificacionesAbierto) {
      this.cargarNotificacionesPanel();
    }
  }

  toggleMensajes(event: Event): void {
    event.stopPropagation();
    this.panelNotificacionesAbierto = false;
    this.panelMensajesAbierto = !this.panelMensajesAbierto;
  }

  irAIncidencias(): void {
    this.panelMensajesAbierto = false;
    this.router.navigate(['/dashboard/incidencias']);
  }

  irANotificaciones(): void {
    this.panelNotificacionesAbierto = false;
    if (this.rolUsuario === 'ALUMNO' || this.rolUsuario === 'CHOFER') {
      this.router.navigate(['/dashboard/notificaciones']);
    }
  }

  abrirNotificacion(n: Notificacion, event: Event): void {
    event.stopPropagation();
    if (!n.leido) {
      this.notificacionService.marcarLeida(n.idNotificacion).subscribe({
        next: () => {
          n.leido = true;
          this.cargarBadges();
        }
      });
    }
    this.panelNotificacionesAbierto = false;
    const ruta = this.rutaNotificacion(n.tipo);
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  iconoNotificacion(tipo?: string): string {
    switch ((tipo ?? 'SISTEMA').toUpperCase()) {
      case 'VIAJE': return 'bi-bus-front-fill';
      case 'RUTA': return 'bi-sign-turn-right-fill';
      case 'INCIDENCIA': return 'bi-exclamation-triangle-fill';
      case 'PROGRAMACION': return 'bi-calendar-week-fill';
      case 'RESERVA': return 'bi-ticket-perforated-fill';
      case 'SANCION': return 'bi-shield-lock-fill';
      default: return 'bi-bell-fill';
    }
  }

  rutaNotificacion(tipo?: string): string | null {
    switch ((tipo ?? '').toUpperCase()) {
      case 'VIAJE':
        return this.rolUsuario === 'CHOFER' ? '/dashboard' : '/dashboard/mis-reservas';
      case 'RUTA':
        return '/dashboard/mi-ruta';
      case 'INCIDENCIA':
        return '/dashboard/reportar-incidencia';
      case 'PROGRAMACION':
        return '/dashboard/mi-programacion';
      case 'RESERVA':
        return '/dashboard/mis-reservas';
      case 'SANCION':
        return '/dashboard/reservar';
      default:
        return null;
    }
  }

  tiempoRelativo(fecha?: string): string {
    if (!fecha) return 'Reciente';
    const ms = Date.now() - new Date(fecha).getTime();
    const min = Math.floor(ms / 60000);
    if (min < 1) return 'Ahora';
    if (min < 60) return `Hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `Hace ${h} h`;
    const d = Math.floor(h / 24);
    return `Hace ${d} d`;
  }

  marcarLeida(n: Notificacion, event: Event): void {
    event.stopPropagation();
    this.notificacionService.marcarLeida(n.idNotificacion).subscribe({
      next: () => {
        n.leido = true;
        this.cargarBadges();
      }
    });
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
    sessionStorage.removeItem('rutasmart-mostrar-sancion');
    document.body.classList.remove('nav-open');
    this.router.navigate(['/login']);
  }

  private mostrarModalSancionAlumno(): void {
    if (!this.usuario?.idUsuario) return;

    this.alumnoService.buscarPorUsuario(this.usuario.idUsuario).subscribe({
      next: (alumno) => {
        if (alumno.puedeReservar !== false) return;

        const hasta = this.formatearFecha(alumno.bloqueadoReservasHasta);
        Swal.fire({
          icon: 'error',
          title: 'Estás sancionado',
          html: `
            <p style="margin:0 0 12px">Tienes <strong>${alumno.inasistencias ?? 3} inasistencias</strong> por no abordar tus reservas.</p>
            <p style="margin:0 0 12px">No podrás reservar nuevos viajes hasta el <strong>${hasta}</strong>.</p>
            <p style="margin:0;font-size:13px;opacity:.85">Cuando el chofer valide tu QR, cuenta como asistencia. Sin validación = inasistencia.</p>
          `,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#dc2626',
          allowOutsideClick: false
        });
      }
    });
  }

  private formatearFecha(fecha?: string): string {
    if (!fecha) return '—';
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }

  private obtenerIniciales(nombre: string): string {
    const partes = (nombre || 'RS').trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return 'RS';
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  private cargarBadges(): void {
    if (this.rolUsuario === 'ADMINISTRADOR') {
      this.notificacionService.contarNoLeidasGlobales().subscribe({
        next: (n) => (this.notificacionesNoLeidas = n),
        error: () => (this.notificacionesNoLeidas = 0)
      });
      this.notificacionService.recientes().subscribe({
        next: (lista) => {
          this.notificacionesRecientes = lista.slice(0, 6);
        },
        error: () => (this.notificacionesRecientes = [])
      });
      this.dashboardService.dashboardAdmin().subscribe({
        next: (d) => (this.incidenciasBadge = d.incidenciasPendientes ?? 0),
        error: () => (this.incidenciasBadge = 0)
      });
    } else if (this.usuario?.idUsuario) {
      this.notificacionService.contarNoLeidasUsuario(this.usuario.idUsuario).subscribe({
        next: (n) => (this.notificacionesNoLeidas = n),
        error: () => (this.notificacionesNoLeidas = 0)
      });
      this.notificacionService.listarPorUsuario(this.usuario.idUsuario).subscribe({
        next: (lista) => (this.notificacionesRecientes = lista.slice(0, 6)),
        error: () => (this.notificacionesRecientes = [])
      });
    }
  }

  private cargarNotificacionesPanel(): void {
    if (this.rolUsuario === 'ADMINISTRADOR') {
      this.notificacionService.recientes().subscribe({
        next: (lista) => (this.notificacionesRecientes = lista.slice(0, 8))
      });
    } else if (this.usuario?.idUsuario) {
      this.notificacionService.listarPorUsuario(this.usuario.idUsuario).subscribe({
        next: (lista) => (this.notificacionesRecientes = lista.slice(0, 8))
      });
    }
  }
}
