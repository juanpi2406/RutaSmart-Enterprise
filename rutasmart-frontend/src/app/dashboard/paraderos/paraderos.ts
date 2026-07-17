import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParaderoService } from '../../service/paradero';
import { RutaService } from '../../service/ruta';
import { Paradero } from '../../models/paradero';
import { Ruta } from '../../models/ruta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paraderos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paraderos.html',
  styleUrls: ['./paraderos.css']
})
export class ParaderosComponent implements OnInit {

  private paraderoService = inject(ParaderoService);
  private rutaService = inject(RutaService);
  private cdr = inject(ChangeDetectorRef);

  rutas: Ruta[] = [];
  rutaSeleccionada = 0;

  paraderosLista: Paradero[] = [];
  paraderosFiltrados: Paradero[] = [];
  filtroTexto = '';
  cargando = false;

  mostrarModal = false;
  paraderoEnEdicion: Paradero | null = null;
  form: Partial<Paradero> = {};

  ngOnInit(): void {
    this.cargarRutas();
    this.listarParaderos();
  }

  cargarRutas(): void {
    this.rutaService.listar().subscribe({
      next: (data) => {
        this.rutas = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  listarParaderos(): void {
    this.cargando = true;

    const obs = this.rutaSeleccionada > 0
      ? this.paraderoService.listarPorRuta(this.rutaSeleccionada)
      : this.paraderoService.listar();

    obs.subscribe({
      next: (data) => {
        this.paraderosLista = data;
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

  cambiarRutaFiltro(event: Event): void {
    this.rutaSeleccionada = Number((event.target as HTMLSelectElement).value);
    this.listarParaderos();
  }

  filtrarParaderos(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.paraderosFiltrados = this.paraderosLista.filter(p =>
      p.nombre.toLowerCase().includes(this.filtroTexto)
    );
  }

  nombreRuta(idRuta: number): string {
    return this.rutas.find(r => r.idRuta === idRuta)?.nombre ?? '-';
  }

  abrirModalCrear(): void {
    this.paraderoEnEdicion = null;
    this.form = {
      idRuta: this.rutaSeleccionada > 0 ? this.rutaSeleccionada : (this.rutas[0]?.idRuta ?? undefined),
      nombre: '',
      direccion: '',
      latitud: undefined,
      longitud: undefined,
      orden: undefined,
      tiempoEstimadoMin: undefined,
      estado: true
    };
    this.mostrarModal = true;
  }

  editarParadero(paradero: Paradero): void {
    this.paraderoEnEdicion = paradero;
    this.form = { ...paradero };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.paraderoEnEdicion = null;
    this.form = {};
  }

  guardarParadero(): void {

    if (this.paraderoEnEdicion?.idParadero) {

      this.paraderoService.actualizar(this.paraderoEnEdicion.idParadero, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarParaderos();
          Swal.fire({
            icon: 'success',
            title: 'Paradero actualizado',
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

      this.paraderoService.guardar(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarParaderos();
          Swal.fire({
            icon: 'success',
            title: 'Paradero registrado',
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

  eliminarParadero(id: number): void {

    Swal.fire({
      title: '¿Eliminar paradero?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.paraderoService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Paradero eliminado', timer: 1500, showConfirmButton: false });
          this.listarParaderos();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
