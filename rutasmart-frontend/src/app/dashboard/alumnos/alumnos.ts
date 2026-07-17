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
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './alumnos.html',
  styleUrls: ['./alumnos.css']
})
export class AlumnosComponent implements OnInit {

  /*=========================================
   * SERVICIOS
   =========================================*/

  private alumnoService = inject(AlumnoService);

  private usuarioService = inject(UsuarioService);

  /*=========================================
   * LISTAS
   =========================================*/

  usuarios: Usuario[] = [];

  alumnosLista: AlumnoConNombre[] = [];

  alumnosFiltrados: AlumnoConNombre[] = [];

  /*=========================================
   * FILTROS
   =========================================*/

  filtroTexto = '';

  cargando = false;

  /*=========================================
   * MODAL
   =========================================*/

  mostrarModal = false;

  alumnoEnEdicion: AlumnoConNombre | null = null;

  form: Partial<Alumno> = {};

  /*=========================================
   * INIT
   =========================================*/

  ngOnInit(): void {

    this.cargarUsuarios();

  }

  /*=========================================
   * USUARIOS
   =========================================*/

  cargarUsuarios(): void {

    this.usuarioService.listar().subscribe({

      next: (respuesta) => {

        this.usuarios = respuesta.data;

        this.listarAlumnos();

      },

      error: (err) => console.error(err)

    });

  }

  /*=========================================
   * LISTAR
   =========================================*/

  listarAlumnos(): void {

    this.cargando = true;

    this.alumnoService.listar().subscribe({

      next: (data) => {

        this.alumnosLista = data.map(a => this.enriquecer(a));

        this.aplicarFiltros();

        this.cargando = false;

      },

      error: (error) => {

        console.error(error);

        this.cargando = false;

      }

    });

  }

  /*=========================================
   * COMPLETAR DATOS
   =========================================*/

  private enriquecer(

    alumno: Alumno

  ): AlumnoConNombre {

    const usuario = this.usuarios.find(

      u => u.idUsuario === alumno.idUsuario

    );

    return {

      ...alumno,

      nombreCompleto: usuario

        ? `${usuario.nombres} ${usuario.apellidos}`

        : '(Usuario)',

      codigoUsuario: usuario?.codigo ?? '-'

    };

  }

  /*=========================================
   * FILTRAR
   =========================================*/

  filtrarAlumnos(event: Event): void {

    this.filtroTexto =

      (event.target as HTMLInputElement)

        .value

        .toLowerCase();

    this.aplicarFiltros();

  }

  aplicarFiltros(): void {

    this.alumnosFiltrados =

      this.alumnosLista.filter(a => {

        const texto =

          `${a.nombreCompleto}

          ${a.codigoUsuario}

          ${a.codigoUniversitario}`

            .toLowerCase();

        return texto.includes(

          this.filtroTexto

        );

      });

  }

  /*=========================================
   * EDITAR
   =========================================*/

  editarAlumno(

    alumno: AlumnoConNombre

  ): void {

    this.alumnoEnEdicion = alumno;

    this.form = {

      codigoUniversitario:

        alumno.codigoUniversitario,

      facultad:

        alumno.facultad,

      sede:

        alumno.sede,

      ciclo:

        alumno.ciclo,

      estado:

        alumno.estado

    };

    this.mostrarModal = true;

  }

  /*=========================================
   * CERRAR
   =========================================*/

  cerrarModal(): void {

    this.mostrarModal = false;

    this.alumnoEnEdicion = null;

    this.form = {};

  }


   /*=========================================
   * GUARDAR
   * (Solo actualiza datos académicos)
   =========================================*/

  guardarAlumno(): void {

    if (!this.alumnoEnEdicion) {

      return;

    }

    this.alumnoService.actualizar(

      this.alumnoEnEdicion.idAlumno,

      this.form

    ).subscribe({

      next: () => {

        this.cerrarModal();

        this.listarAlumnos();

        Swal.fire({

          icon: 'success',

          title: 'Alumno actualizado',

          text: 'Los datos académicos fueron actualizados correctamente.',

          timer: 1800,

          showConfirmButton: false

        });

      },

      error: (error) => {

        Swal.fire({

          icon: 'error',

          title: 'Error',

          text: error.error?.message ?? 'Ocurrió un error.'

        });

      }

    });

  }

  /*=========================================
   * CAMBIAR ESTADO
   =========================================*/

  cambiarEstado(alumno: AlumnoConNombre): void {

    Swal.fire({

      title: alumno.estado

        ? '¿Desactivar alumno?'

        : '¿Activar alumno?',

      text: 'El alumno seguirá existiendo en el sistema.',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: alumno.estado

        ? 'Desactivar'

        : 'Activar',

      cancelButtonText: 'Cancelar'

    }).then((result) => {

      if (!result.isConfirmed) {

        return;

      }

      const dto = {

        codigoUniversitario:

          alumno.codigoUniversitario,

        facultad:

          alumno.facultad,

        sede:

          alumno.sede,

        ciclo:

          alumno.ciclo,

        estado:

          !alumno.estado

      };

      this.alumnoService.actualizar(

        alumno.idAlumno,

        dto

      ).subscribe({

        next: () => {

          Swal.fire({

            icon: 'success',

            title: 'Estado actualizado',

            timer: 1500,

            showConfirmButton: false

          });

          this.listarAlumnos();

        },

        error: (error) => {

          Swal.fire({

            icon: 'error',

            title: 'Error',

            text:

              error.error?.message ??

              'No fue posible actualizar el estado.'

          });

        }

      });

    });

  }

}
