import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../service/reserva';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css']
})
export class ReservasComponent implements OnInit {
  private reservaService = inject(ReservaService);

  reservasLista: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  filtroTexto = '';
  filtroEstado = 'TODOS';

  mostrarModal = false;
  reservaEnEdicion: Reserva | null = null;
  form: Partial<Reserva> = {};

  ngOnInit(): void {
    this.listarReservas();
  }

  listarReservas(): void {
    this.reservaService.listar().subscribe({
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
      const codigo = (r.codigoQr || '').toLowerCase();
      const texto = codigo.includes(this.filtroTexto) || String(r.idReserva).includes(this.filtroTexto);
      const estado = this.filtroEstado === 'TODOS' || r.estado === this.filtroEstado;
      return texto && estado;
    });
  }

  abrirModalCrear(): void {
    this.reservaEnEdicion = null;
    this.form = {
      idAlumno: 0,
      idViaje: 0,
      idParadero: 0,
      estado: 'PENDIENTE'
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.reservaEnEdicion = null;
    this.form = {};
  }

  guardarReserva(event: Event): void {
    event.preventDefault();
    if (!this.form.idAlumno || !this.form.idViaje || !this.form.idParadero) return;

    if (this.reservaEnEdicion?.idReserva) {
      this.reservaService.actualizar(this.reservaEnEdicion.idReserva, this.form).subscribe({
        next: () => {
          this.listarReservas();
          this.cerrarModal();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.reservaService.guardar(this.form).subscribe({
        next: () => {
          this.listarReservas();
          this.cerrarModal();
        },
        error: (err) => console.error(err)
      });
    }
  }

  confirmarReserva(id: number): void {
    this.reservaService.buscarPorId(id).subscribe({
      next: (reserva) => {
        reserva.estado = 'CONFIRMADA';
        this.reservaService.actualizar(id, reserva).subscribe({
          next: () => this.listarReservas(),
          error: (err) => console.error(err)
        });
      },
      error: (err) => console.error(err)
    });
  }

  cancelarReserva(id: number): void {
    this.reservaService.buscarPorId(id).subscribe({
      next: (reserva) => {
        reserva.estado = 'CANCELADA';
        this.reservaService.actualizar(id, reserva).subscribe({
          next: () => this.listarReservas(),
          error: (err) => console.error(err)
        });
      },
      error: (err) => console.error(err)
    });
  }
}
