import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../service/reserva';
import { SessionService } from '../../service/session';
import { AlumnoService } from '../../service/alumno';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reservas.html',
  styleUrls: ['../reservas/reservas.css', './mis-reservas.css']
})
export class MisReservasComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private session = inject(SessionService);
  private alumnoService = inject(AlumnoService);

  reservasLista: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  idAlumno = 0;
  filtroTexto = '';
  filtroEstado = 'TODOS';

  ngOnInit(): void {
    this.cargarAlumno();
  }

  cargarAlumno(): void {
    const usuario = this.session.obtener();
    if (!usuario) return;

    this.alumnoService.buscarPorUsuario(usuario.idUsuario).subscribe({
      next: (alumno) => {
        this.idAlumno = alumno.idAlumno;
        this.listarReservas();
      },
      error: (err) => {
        console.error('No se pudo resolver el alumno del usuario logueado', err);
      }
    });
  }

  listarReservas(): void {
    if (!this.idAlumno) return;
    this.reservaService.listarPorAlumno(this.idAlumno).subscribe({
      next: (data) => {
        this.reservasLista = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error(err)
    });
  }

  filtrarReservas(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroTexto = input.value.toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado = select.value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.reservasFiltradas = this.reservasLista.filter(r => {
      const texto = (r.codigoQr || r.idReserva.toString()).toLowerCase().includes(this.filtroTexto);
      const estado = this.filtroEstado === 'TODOS' || r.estado === this.filtroEstado;
      return texto && estado;
    });
  }

  cancelarReserva(reserva: Reserva): void {
    if (reserva.estado === 'CANCELADO' || reserva.estado === 'NO_ASISTIO') {
      return;
    }
    if (!confirm(`¿Cancelar la reserva #${reserva.idReserva}?`)) {
      return;
    }
    this.reservaService.actualizar(reserva.idReserva, {
      idAlumno: reserva.idAlumno,
      idViaje: reserva.idViaje,
      idParadero: reserva.idParadero,
      estado: 'CANCELADO'
    }).subscribe({
      next: () => {
        const idx = this.reservasLista.findIndex(r => r.idReserva === reserva.idReserva);
        if (idx > -1) {
          this.reservasLista[idx] = { ...this.reservasLista[idx], estado: 'CANCELADO' };
        }
        this.aplicarFiltros();
        this.listarReservas();
        alert('Reserva cancelada correctamente');
      },
      error: (err) => {
        console.error(err);
        alert(err?.status ? `Error ${err.status}` : 'Error al cancelar la reserva');
      }
    });
  }
}
