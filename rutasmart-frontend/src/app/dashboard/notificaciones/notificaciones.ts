import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../service/notificacion';
import { SessionService } from '../../service/session';
import { Notificacion } from '../../models/notificacion';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.html',
  styleUrls: ['./notificaciones.css']
})
export class NotificacionesComponent implements OnInit {

  private notificacionService = inject(NotificacionService);
  private session = inject(SessionService);

  notificacionesLista: Notificacion[] = [];
  cargando = false;

  ngOnInit(): void {
    this.listarNotificaciones();
  }

  listarNotificaciones(): void {
    this.cargando = true;
    const usuario = this.session.obtener();

    this.notificacionService.listar().subscribe({
      next: (data) => {
        this.notificacionesLista = data
          .filter(n => n.idUsuario === usuario?.idUsuario)
          .sort((a, b) => (b.fechaEnvio ?? '').localeCompare(a.fechaEnvio ?? ''));
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

  marcarLeido(notificacion: Notificacion): void {

    this.notificacionService.actualizar(notificacion.idNotificacion, { ...notificacion, leido: true }).subscribe({
      next: () => this.listarNotificaciones(),
      error: (err) => console.error(err)
    });

  }

}
