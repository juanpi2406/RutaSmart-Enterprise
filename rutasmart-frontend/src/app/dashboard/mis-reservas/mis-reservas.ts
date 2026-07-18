import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ReservaService } from '../../service/reserva';
import { SessionService } from '../../service/session';
import { AlumnoService } from '../../service/alumno';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-reservas.html',
  styleUrls: ['../alumno-shared.css', '../reservas/reservas.css', './mis-reservas.css']
})
export class MisReservasComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private session = inject(SessionService);
  private alumnoService = inject(AlumnoService);
  private cdr = inject(ChangeDetectorRef);

  reservasLista: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  idAlumno = 0;
  filtroTexto = '';
  filtroEstado = 'TODOS';
  cargando = true;

  ngOnInit(): void {
    this.cargarAlumno();
  }

  get totalReservas(): number {
    return this.reservasLista.length;
  }

  get reservasActivas(): number {
    return this.reservasLista.filter(r => r.estado === 'RESERVADO' || r.estado === 'ABORDADO').length;
  }

  get reservasCanceladas(): number {
    return this.reservasLista.filter(r => r.estado === 'CANCELADO').length;
  }

  cargarAlumno(): void {
    const usuario = this.session.obtener();
    if (!usuario?.idUsuario) {
      this.cargando = false;
      return;
    }

    this.alumnoService.buscarPorUsuario(usuario.idUsuario).subscribe({
      next: (alumno) => {
        this.idAlumno = alumno.idAlumno;
        this.listarReservas();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  listarReservas(): void {
    if (!this.idAlumno) return;
    this.cargando = true;
    this.reservaService.listarPorAlumno(this.idAlumno).subscribe({
      next: (data) => {
        this.reservasLista = data;
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.reservasLista = [];
        this.reservasFiltradas = [];
        this.cargando = false;
        this.cdr.markForCheck();
      }
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

  claseEstado(estado: string): string {
    return estado.toLowerCase().replace('_', '_');
  }

  cancelarReserva(reserva: Reserva): void {
    if (reserva.estado === 'CANCELADO' || reserva.estado === 'NO_ASISTIO') return;

    Swal.fire({
      title: '¿Cancelar reserva?',
      text: `Se cancelará la reserva #${reserva.idReserva}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
      confirmButtonColor: '#dc2626'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.reservaService.actualizar(reserva.idReserva, {
        idAlumno: reserva.idAlumno,
        idViaje: reserva.idViaje,
        idParadero: reserva.idParadero,
        estado: 'CANCELADO'
      }).subscribe({
        next: () => {
          this.listarReservas();
          Swal.fire({
            icon: 'success',
            title: 'Reserva cancelada',
            timer: 1600,
            showConfirmButton: false
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo cancelar',
            text: err?.error?.message ?? 'Inténtalo nuevamente.'
          });
        }
      });
    });
  }
}
