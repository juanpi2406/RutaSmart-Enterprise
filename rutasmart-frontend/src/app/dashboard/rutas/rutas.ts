import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RutaService } from '../../service/ruta';
import { Ruta } from '../../models/ruta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rutas.html',
  styleUrls: ['./rutas.css']
})
export class RutasComponent implements OnInit {

  private rutaService = inject(RutaService);
  private cdr = inject(ChangeDetectorRef);

  rutasLista: Ruta[] = [];
  rutasFiltradas: Ruta[] = [];
  totalActivas = 0;

  filtroTexto = '';
  filtroEstado = 'TODOS';
  cargando = false;

  mostrarModal = false;
  rutaEnEdicion: Ruta | null = null;
  form: Partial<Ruta> = {};

  ngOnInit(): void {
    this.listarRutas();
  }

  listarRutas(): void {
    this.cargando = true;
    this.rutaService.listar().subscribe({
      next: (data) => {
        this.rutasLista = data;
        this.rutasFiltradas = [...this.rutasLista];
        this.totalActivas = this.rutasLista.filter(r => r.estado === true).length;
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

  filtrarRutas(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  cambiarFiltroEstado(event: Event): void {
    this.filtroEstado = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.rutasFiltradas = this.rutasLista.filter(ruta => {
      const texto = `${ruta.codigo} ${ruta.nombre} ${ruta.origen} ${ruta.destino}`.toLowerCase();
      const coincideTexto = texto.includes(this.filtroTexto);
      const coincideEstado =
        this.filtroEstado === 'TODOS' ||
        (this.filtroEstado === 'ACTIVO' && ruta.estado === true) ||
        (this.filtroEstado === 'INACTIVO' && ruta.estado === false);
      return coincideTexto && coincideEstado;
    });
  }

  abrirModalCrear(): void {
    this.rutaEnEdicion = null;
    this.form = {
      codigo: '',
      nombre: '',
      origen: '',
      destino: '',
      descripcion: '',
      distanciaKm: undefined,
      tiempoEstimadoMin: undefined,
      estado: true
    };
    this.mostrarModal = true;
  }

  editarRuta(ruta: Ruta): void {
    this.rutaEnEdicion = ruta;
    this.form = { ...ruta };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.rutaEnEdicion = null;
    this.form = {};
  }

  guardarRuta(): void {

    if (this.rutaEnEdicion?.idRuta) {

      this.rutaService.actualizar(this.rutaEnEdicion.idRuta, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarRutas();
          Swal.fire({
            icon: 'success',
            title: 'Ruta actualizada',
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

      this.rutaService.guardar(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarRutas();
          Swal.fire({
            icon: 'success',
            title: 'Ruta registrada',
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

  eliminarRuta(id: number): void {

    Swal.fire({
      title: '¿Eliminar ruta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.rutaService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Ruta eliminada', timer: 1500, showConfirmButton: false });
          this.listarRutas();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
