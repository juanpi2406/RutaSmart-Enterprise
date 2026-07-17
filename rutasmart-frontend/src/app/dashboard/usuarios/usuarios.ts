import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../service/usuario';
import { Usuario, ApiResponse } from '../../models/usuario';

import { RolService, Rol } from '../../service/rol';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  /*=========================================
   * INYECCIÓN DE SERVICIOS
   =========================================*/

  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);

  /*=========================================
   * LISTAS
   =========================================*/

  usuariosLista: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  roles: Rol[] = [];

  /*=========================================
   * ESTADÍSTICAS
   =========================================*/

  totalActivos = 0;
  totalAdministradores = 0;
  totalAlumnos = 0;
  totalChoferes = 0;

  /*=========================================
   * FILTROS
   =========================================*/

  filtroTexto = '';
  filtroRol = 'TODOS';

  /*=========================================
   * UI
   =========================================*/

  cargando = false;
  mostrarModal = false;

  usuarioEnEdicion: Usuario | null = null;

  /*=========================================
   * VISIBILIDAD DE CAMPOS
   =========================================*/

  mostrarDatosAlumno = false;

  mostrarDatosChofer = false;

  /*=========================================
   * FORMULARIO
   =========================================*/

  form: Partial<Usuario> = {};

  /*=========================================
   * INIT
   =========================================*/

  ngOnInit(): void {

    this.listarUsuarios();

    this.cargarRoles();

  }

  /*=========================================
   * LISTAR
   =========================================*/

  listarUsuarios(): void {

    this.cargando = true;

    this.usuarioService.listar().subscribe({

      next: (respuesta) => {

        this.usuariosLista = respuesta.data;

        this.usuariosFiltrados = [...this.usuariosLista];

        this.totalActivos =
          this.usuariosLista.filter(x => x.estado).length;

        this.totalAdministradores =
          this.usuariosLista.filter(x => x.nombreRol == 'ADMINISTRADOR').length;

        this.totalAlumnos =
          this.usuariosLista.filter(x => x.nombreRol == 'ALUMNO').length;

        this.totalChoferes =
          this.usuariosLista.filter(x => x.nombreRol == 'CHOFER').length;

        this.cargando = false;

      },

      error: (err) => {

        console.error(err);

        this.cargando = false;

      }

    });

  }

  /*=========================================
   * ROLES
   =========================================*/

  cargarRoles(): void {

    this.rolService.listar().subscribe({

      next: (response) => {

        this.roles = response.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  /*=========================================
   * CAMBIO DE ROL
   =========================================*/

  cambiarRol(): void {

    const rol = this.roles.find(

      r => r.idRol == this.form.idRol

    );

    this.mostrarDatosAlumno = false;

    this.mostrarDatosChofer = false;

    if (!rol) {

      return;

    }

    switch (rol.nombre.toUpperCase()) {

      case 'ALUMNO':

        this.mostrarDatosAlumno = true;

        break;

      case 'CHOFER':

        this.mostrarDatosChofer = true;

        break;

    }

  }

  /*=========================================
   * ABRIR MODAL
   =========================================*/

  abrirModalCrear(): void {

    this.usuarioEnEdicion = null;

    this.form = {

      codigo: '',

      nombres: '',

      apellidos: '',

      correo: '',

      telefono: '',

      password: '',

      estado: true,

      idRol: this.roles.length
        ? this.roles[0].idRol
        : undefined,

      /* Alumno */

      codigoUniversitario: '',

      facultad: '',

      sede: '',

      ciclo: undefined,

      /* Chofer */

      numeroLicencia: '',

      categoriaLicencia: '',

      fechaVencimiento: ''

    };

    this.cambiarRol();

    this.mostrarModal = true;

  }

  /*=========================================
   * EDITAR
   =========================================*/

  editarUsuario(usuario: Usuario): void {

    this.usuarioEnEdicion = usuario;

    this.form = {

      ...usuario

    };

    this.cambiarRol();

    this.mostrarModal = true;

  }

  /*=========================================
   * CERRAR
   =========================================*/

  cerrarModal(): void {

    this.mostrarModal = false;

    this.usuarioEnEdicion = null;

    this.mostrarDatosAlumno = false;

    this.mostrarDatosChofer = false;

    this.form = {};

  }

  /*=========================================
   * FILTROS
   =========================================*/

  filtrarUsuarios(event: Event): void {

    this.filtroTexto =
      (event.target as HTMLInputElement)
        .value
        .toLowerCase();

    this.aplicarFiltros();

  }

  cambiarFiltroRol(event: Event): void {

    this.filtroRol =
      (event.target as HTMLSelectElement).value;

    this.aplicarFiltros();

  }

  aplicarFiltros(): void {

    this.usuariosFiltrados =
      this.usuariosLista.filter(usuario => {

        const nombre =
          `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();

        const codigo =
          usuario.codigo.toLowerCase();

        const coincideTexto =
          nombre.includes(this.filtroTexto)
          || codigo.includes(this.filtroTexto);

        const coincideRol =
          this.filtroRol === 'TODOS'
          || usuario.nombreRol === this.filtroRol;

        return coincideTexto && coincideRol;

      });

  }
  /*=========================================
   * GUARDAR USUARIO
   =========================================*/

  guardarUsuario(): void {

    this.cambiarRol();

    if (this.usuarioEnEdicion?.idUsuario) {

      this.usuarioService.actualizar(

        this.usuarioEnEdicion.idUsuario,

        this.form

      ).subscribe({

        next: () => {

          this.cerrarModal();

          this.listarUsuarios();

          Swal.fire({

            icon: 'success',

            title: 'Usuario actualizado',

            text: 'Se actualizó correctamente.',

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

    } else {

      this.usuarioService.guardar(

        this.form

      ).subscribe({

        next: () => {

          this.cerrarModal();

          this.listarUsuarios();

          Swal.fire({

            icon: 'success',

            title: 'Usuario registrado',

            text: 'Registro exitoso.',

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

  }

  /*=========================================
   * ELIMINAR
   =========================================*/

  eliminarUsuario(id: number): void {

    Swal.fire({

      title: '¿Eliminar usuario?',

      text: 'Esta acción no se puede deshacer.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Eliminar',

      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#d33'

    }).then((result) => {

      if (!result.isConfirmed) {

        return;

      }

      this.usuarioService.eliminar(id).subscribe({

        next: () => {

          Swal.fire({

            icon: 'success',

            title: 'Usuario eliminado',

            timer: 1500,

            showConfirmButton: false

          });

          this.listarUsuarios();

        },

        error: (error) => {

          Swal.fire({

            icon: 'error',

            title: 'No se pudo eliminar',

            text: error.error?.message ?? 'Ocurrió un error.'

          });

        }

      });

    });

  }

}
