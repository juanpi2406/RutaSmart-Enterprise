import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '../../service/viaje';
import { BusService } from '../../service/bus';
import { ChoferService } from '../../service/chofer';
import { ProgramacionViajeService } from '../../service/programacion-viaje';
import { RutaService } from '../../service/ruta';
import { Viaje } from '../../models/viaje';
import { Bus } from '../../models/bus';
import { ChoferResponse } from '../../models/chofer';
import { ProgramacionViaje } from '../../models/programacion-viaje';
import { Ruta } from '../../models/ruta';
import Swal from 'sweetalert2';

const ESTADOS = ['PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'];

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viajes.html',
  styleUrls: ['./viajes.css']
})
export class ViajesComponent implements OnInit {

  private viajeService = inject(ViajeService);
  private busService = inject(BusService);
  private choferService = inject(ChoferService);
  private programacionService = inject(ProgramacionViajeService);
  private rutaService = inject(RutaService);
  private cdr = inject(ChangeDetectorRef);

  estados = ESTADOS;

  buses: Bus[] = [];
  choferes: ChoferResponse[] = [];
  programaciones: ProgramacionViaje[] = [];
  rutas: Ruta[] = [];

  viajesLista: Viaje[] = [];
  viajesFiltrados: Viaje[] = [];
  filtroTexto = '';
  filtroEstado = 'TODOS';
  cargando = false;

  mostrarModal = false;
  viajeEnEdicion: Viaje | null = null;
  form: Partial<Viaje> = {};

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    this.busService.listar().subscribe({ next: (data) => { this.buses = data; this.cdr.detectChanges(); } });
    this.rutaService.listar().subscribe({ next: (data) => { this.rutas = data; this.cdr.detectChanges(); } });
    this.choferService.listar().subscribe({ next: (respuesta) => { this.choferes = respuesta.data; this.cdr.detectChanges(); } });
    this.programacionService.listar().subscribe({
      next: (data) => {
        this.programaciones = data;
        this.listarViajes();
        this.cdr.detectChanges();
      }
    });
  }

  listarViajes(): void {
    this.cargando = true;
    this.viajeService.listar().subscribe({
      next: (data) => {
        this.viajesLista = data;
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nombreBus(idBus: number): string {
    return this.buses.find(b => b.idBus === idBus)?.codigo ?? '-';
  }

  nombreChofer(idChofer: number): string {
    const chofer = this.choferes.find(c => c.idChofer === idChofer);
    return chofer ? `${chofer.nombres} ${chofer.apellidos}` : '-';
  }

  nombreRuta(idProgramacion: number): string {
    const prog = this.programaciones.find(p => p.idProgramacion === idProgramacion);
    if (!prog) return '-';
    return this.rutas.find(r => r.idRuta === prog.idRuta)?.nombre ?? '-';
  }

  filtrarViajes(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(event: Event): void {
    this.filtroEstado = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.viajesFiltrados = this.viajesLista.filter(v => {
      const texto = `${this.nombreBus(v.idBus)} ${this.nombreChofer(v.idChofer)} ${this.nombreRuta(v.idProgramacion)}`.toLowerCase();
      const coincideTexto = texto.includes(this.filtroTexto);
      const coincideEstado = this.filtroEstado === 'TODOS' || v.estado === this.filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }

  abrirModalCrear(): void {
    this.viajeEnEdicion = null;
    this.form = {
      idProgramacion: this.programaciones[0]?.idProgramacion,
      idBus: this.buses[0]?.idBus,
      idChofer: this.choferes[0]?.idChofer,
      fechaViaje: '',
      estado: 'PROGRAMADO',
      observaciones: ''
    };
    this.mostrarModal = true;
  }

  editarViaje(viaje: Viaje): void {
    this.viajeEnEdicion = viaje;
    this.form = { ...viaje };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.viajeEnEdicion = null;
    this.form = {};
  }

  guardarViaje(): void {

    if (this.viajeEnEdicion?.idViaje) {

      this.viajeService.actualizar(this.viajeEnEdicion.idViaje, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarViajes();
          Swal.fire({
            icon: 'success',
            title: 'Viaje actualizado',
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

      this.viajeService.guardar(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarViajes();
          Swal.fire({
            icon: 'success',
            title: 'Viaje registrado',
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

  eliminarViaje(id: number): void {

    Swal.fire({
      title: '¿Eliminar viaje?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.viajeService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Viaje eliminado', timer: 1500, showConfirmButton: false });
          this.listarViajes();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
