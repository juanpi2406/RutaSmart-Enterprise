import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NotificacionService } from '../../service/notificacion';
import { SessionService } from '../../service/session';
import { Notificacion } from '../../models/notificacion';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notificaciones.html',
  styleUrls: ['../alumno-shared.css', '../reservas/reservas.css', './notificaciones.css']
})
export class NotificacionesComponent implements OnInit {

  private notificacionService = inject(NotificacionService);
  private session = inject(SessionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  notificacionesLista: Notificacion[] = [];
  cargando = false;
  esAdmin = false;

  ngOnInit(): void {
    this.esAdmin = this.session.obtenerRol() === 'ADMINISTRADOR';
    this.listarNotificaciones();
  }

  get noLeidas(): number {
    return this.notificacionesLista.filter(n => !n.leido).length;
  }

  get leidas(): number {
    return this.notificacionesLista.filter(n => n.leido).length;
  }

  listarNotificaciones(): void {
    this.cargando = true;
    const usuario = this.session.obtener();

    const peticion = this.esAdmin
      ? this.notificacionService.listar()
      : usuario?.idUsuario
        ? this.notificacionService.listarPorUsuario(usuario.idUsuario)
        : null;

    if (!peticion) {
      this.cargando = false;
      return;
    }

    peticion.subscribe({
      next: (data) => {
        this.notificacionesLista = data;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.notificacionesLista = [];
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  marcarLeido(notificacion: Notificacion): void {
    this.notificacionService.marcarLeida(notificacion.idNotificacion).subscribe({
      next: () => this.listarNotificaciones(),
      error: () => undefined
    });
  }

  marcarTodasLeidas(): void {
    const pendientes = this.notificacionesLista.filter(n => !n.leido);
    if (pendientes.length === 0) return;
    pendientes.forEach(n => this.marcarLeido(n));
  }

  icono(tipo?: string): string {
    switch ((tipo ?? 'SISTEMA').toUpperCase()) {
      case 'VIAJE': return 'bi-bus-front-fill';
      case 'RUTA': return 'bi-sign-turn-right-fill';
      case 'INCIDENCIA': return 'bi-exclamation-triangle-fill';
      case 'PROGRAMACION': return 'bi-calendar-week-fill';
      case 'RESERVA': return 'bi-ticket-perforated-fill';
      default: return 'bi-bell-fill';
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
    return `Hace ${Math.floor(h / 24)} d`;
  }

  irDesdeNotificacion(n: Notificacion): void {
    if (!n.leido) this.marcarLeido(n);
    const rol = this.session.obtenerRol();
    const rutas: Record<string, string> = {
      VIAJE: rol === 'CHOFER' ? '/dashboard' : '/dashboard/mis-reservas',
      RUTA: '/dashboard/mi-ruta',
      INCIDENCIA: '/dashboard/reportar-incidencia',
      PROGRAMACION: '/dashboard/mi-programacion',
      RESERVA: '/dashboard/mis-reservas'
    };
    const destino = rutas[(n.tipo ?? '').toUpperCase()];
    if (destino) this.router.navigate([destino]);
  }
}
