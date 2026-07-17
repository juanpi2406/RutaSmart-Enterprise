import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChoferService } from '../../service/chofer';
import { UsuarioService } from '../../service/usuario';
import { ChoferResponse, ChoferCreate, ChoferUpdate } from '../../models/chofer';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-choferes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './choferes.html',
  styleUrls: ['./choferes.css']
})
export class ChoferesComponent implements OnInit {

  private choferService = inject(ChoferService);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: Usuario[] = [];
  usuariosDisponibles: Usuario[] = [];

  choferesLista: ChoferResponse[] = [];
  choferesFiltrados: ChoferResponse[] = [];
  filtroTexto = '';
  cargando = false;

  mostrarModal = false;
  choferEnEdicion: ChoferResponse | null = null;
  form: Partial<ChoferCreate & ChoferUpdate> = {};

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (respuesta) => {
        this.usuarios = respuesta.data;
        this.listarChoferes();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  listarChoferes(): void {
    this.cargando = true;
    this.choferService.listar().subscribe({
      next: (respuesta) => {
        this.choferesLista = respuesta.data;
        this.calcularDisponibles();
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

  private calcularDisponibles(): void {
    const idsConChofer = new Set(this.choferesLista.map(c => c.idUsuario));
    this.usuariosDisponibles = this.usuarios.filter(u =>
      u.nombreRol === 'CHOFER' && (!idsConChofer.has(u.idUsuario) || u.idUsuario === this.choferEnEdicion?.idUsuario)
    );
  }

  filtrarChoferes(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.choferesFiltrados = this.choferesLista.filter(c => {
      const texto = `${c.nombres} ${c.apellidos} ${c.codigo} ${c.numeroLicencia}`.toLowerCase();
      return texto.includes(this.filtroTexto);
    });
  }

  abrirModalCrear(): void {
    this.choferEnEdicion = null;
    this.calcularDisponibles();
    this.form = {
      idUsuario: this.usuariosDisponibles[0]?.idUsuario ?? undefined,
      numeroLicencia: '',
      categoriaLicencia: '',
      fechaVencimiento: '',
      estado: true
    };
    this.mostrarModal = true;
  }

  editarChofer(chofer: ChoferResponse): void {
    this.choferEnEdicion = chofer;
    this.calcularDisponibles();
    this.form = {
      numeroLicencia: chofer.numeroLicencia,
      categoriaLicencia: chofer.categoriaLicencia,
      fechaVencimiento: chofer.fechaVencimiento,
      estado: chofer.estado
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.choferEnEdicion = null;
    this.form = {};
  }

  guardarChofer(): void {

    if (this.choferEnEdicion?.idChofer) {

      const dto: ChoferUpdate = {
        numeroLicencia: this.form.numeroLicencia!,
        categoriaLicencia: this.form.categoriaLicencia!,
        fechaVencimiento: this.form.fechaVencimiento!,
        estado: this.form.estado!
      };

      this.choferService.actualizar(this.choferEnEdicion.idChofer, dto).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarChoferes();
          Swal.fire({
            icon: 'success',
            title: 'Chofer actualizado',
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

      const dto: ChoferCreate = {
        idUsuario: this.form.idUsuario!,
        numeroLicencia: this.form.numeroLicencia!,
        categoriaLicencia: this.form.categoriaLicencia!,
        fechaVencimiento: this.form.fechaVencimiento!,
        estado: true
      };

      this.choferService.crear(dto).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarChoferes();
          Swal.fire({
            icon: 'success',
            title: 'Chofer registrado',
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

  eliminarChofer(id: number): void {

    Swal.fire({
      title: '¿Eliminar chofer?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.choferService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Chofer eliminado', timer: 1500, showConfirmButton: false });
          this.listarChoferes();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
