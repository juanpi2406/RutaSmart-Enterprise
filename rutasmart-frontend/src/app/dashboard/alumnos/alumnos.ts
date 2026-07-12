import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoService } from '../../service/alumno';
import { UsuarioService } from '../../service/usuario';
import { Alumno } from '../../models/alumno';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

interface AlumnoConNombre extends Alumno {
  nombreCompleto: string;
  codigoUsuario: string;
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.css']
})
export class AlumnosComponent implements OnInit {

  private alumnoService = inject(AlumnoService);
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  usuariosDisponibles: Usuario[] = [];

  alumnosLista: AlumnoConNombre[] = [];
  alumnosFiltrados: AlumnoConNombre[] = [];
  filtroTexto = '';
  cargando = false;

  mostrarModal = false;
  alumnoEnEdicion: AlumnoConNombre | null = null;
  form: Partial<Alumno> = {};

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (respuesta) => {
        this.usuarios = respuesta.data;
        this.listarAlumnos();
      },
      error: (err) => console.error(err)
    });
  }

  listarAlumnos(): void {
    this.cargando = true;
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnosLista = data.map(a => this.enriquecer(a));
        this.calcularDisponibles();
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

  private enriquecer(alumno: Alumno): AlumnoConNombre {
    const usuario = this.usuarios.find(u => u.idUsuario === alumno.idUsuario);
    return {
      ...alumno,
      nombreCompleto: usuario ? `${usuario.nombres} ${usuario.apellidos}` : '(usuario no encontrado)',
      codigoUsuario: usuario?.codigo ?? '-'
    };
  }

  private calcularDisponibles(): void {
    const idsConAlumno = new Set(this.alumnosLista.map(a => a.idUsuario));
    this.usuariosDisponibles = this.usuarios.filter(u =>
      u.nombreRol === 'ALUMNO' && (!idsConAlumno.has(u.idUsuario) || u.idUsuario === this.alumnoEnEdicion?.idUsuario)
    );
  }

  filtrarAlumnos(event: Event): void {
    this.filtroTexto = (event.target as HTMLInputElement).value.toLowerCase();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.alumnosFiltrados = this.alumnosLista.filter(a => {
      const texto = `${a.nombreCompleto} ${a.codigoUniversitario} ${a.codigoUsuario}`.toLowerCase();
      return texto.includes(this.filtroTexto);
    });
  }

  abrirModalCrear(): void {
    this.alumnoEnEdicion = null;
    this.calcularDisponibles();
    this.form = {
      idUsuario: this.usuariosDisponibles[0]?.idUsuario ?? undefined,
      codigoUniversitario: '',
      facultad: '',
      sede: '',
      ciclo: undefined,
      estado: true
    };
    this.mostrarModal = true;
  }

  editarAlumno(alumno: AlumnoConNombre): void {
    this.alumnoEnEdicion = alumno;
    this.calcularDisponibles();
    this.form = { ...alumno };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.alumnoEnEdicion = null;
    this.form = {};
  }

  guardarAlumno(): void {

    if (this.alumnoEnEdicion?.idAlumno) {

      this.alumnoService.actualizar(this.alumnoEnEdicion.idAlumno, this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarAlumnos();
          Swal.fire({
            icon: 'success',
            title: 'Alumno actualizado',
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

      this.alumnoService.guardar(this.form).subscribe({
        next: () => {
          this.cerrarModal();
          this.listarAlumnos();
          Swal.fire({
            icon: 'success',
            title: 'Alumno registrado',
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

  eliminarAlumno(id: number): void {

    Swal.fire({
      title: '¿Eliminar alumno?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.alumnoService.eliminar(id).subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Alumno eliminado', timer: 1500, showConfirmButton: false });
          this.listarAlumnos();
        },
        error: (error) => {
          Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: error.error?.message ?? 'Ocurrió un error.' });
        }
      });

    });

  }

}
