import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BusService } from '../../service/bus';
import { Bus } from '../../models/bus';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buses.html',
  styleUrls: ['./buses.css']
})
export class BusesComponent implements OnInit {

  private busService = inject(BusService);

  busesLista: Bus[] = [];
  busesFiltrados: Bus[] = [];
  totalActivos = 0;

  filtroTexto = '';
  filtroEstado = 'TODOS';
  cargando = false;

  mostrarModal = false;
  busEnEdicion: Bus | null = null;
  form: Partial<Bus> = {};

  ngOnInit(): void {
    this.listarBuses();
  }

  listarBuses(): void {
    this.cargando = true;
    this.busService.listar().subscribe({
      next: (data) => {
        this.busesLista = data;
        this.busesFiltrados = [...this.busesLista];
        this.totalActivos = this.busesLista.filter(b => b.estado === true).length;
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

  filtrarBuses(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(event: Event): void {
    this.filtroEstado = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.busesFiltrados = this.busesLista.filter(bus => {
      const texto = `${bus.codigo} ${bus.placa}`.toLowerCase();
      const coincideTexto = texto.includes(this.filtroTexto);
      const coincideEstado =
        this.filtroEstado === 'TODOS' ||
        (this.filtroEstado === 'ACTIVO' && bus.estado === true) ||
        (this.filtroEstado === 'INACTIVO' && bus.estado === false);
      return coincideTexto && coincideEstado;
    });
  }

  abrirModalCrear(): void {
    this.busEnEdicion = null;
    this.form = {
      codigo: '',
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      capacidadAsientos: undefined,
      observaciones: '',
      estado: true
    };
    this.mostrarModal = true;
  }

  editarBus(bus: Bus): void {
    this.busEnEdicion = bus;
    this.form = { ...bus };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.busEnEdicion = null;
    this.form = {};
  }

  guardarBus(): void {

    if (this.busEnEdicion?.idBus) {

      this.busService.actualizar(this.busEnEdicion.idBus, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarBuses();
          Swal.fire({
            icon: 'success',
            title: 'Bus actualizado',
            text: 'Se actualizó correctamente.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
        }
      });

    } else {

      this.busService.guardar(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarBuses();
          Swal.fire({
            icon: 'success',
            title: 'Bus registrado',
            text: 'Registro exitoso.',
            timer: 1800,
            showConfirmButton: false
          });
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
        }
      });

    }

  }

  eliminarBus(id: number): void {

    Swal.fire({
      title: '¿Eliminar bus?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.busService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Bus eliminado', timer: 1500, showConfirmButton: false });
          this.listarBuses();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
