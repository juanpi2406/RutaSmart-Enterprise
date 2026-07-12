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
  templateUrl: './mis-reservas.html'
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
        this.reservasFiltradas = [...this.reservasLista];
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
}
