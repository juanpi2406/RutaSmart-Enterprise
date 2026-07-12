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

  private usuarioService = inject(UsuarioService);
  private rolService = inject(RolService);

  usuariosLista: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  totalActivos = 0;
  totalAdministradores = 0;
  totalAlumnos = 0;
  totalChoferes = 0;

  filtroTexto = '';
  filtroRol = 'TODOS';
  cargando = false;
  roles: Rol[] = [];
  mostrarModal = false;
  usuarioEnEdicion: Usuario | null = null;
  form: Partial<Usuario> = {};

  ngOnInit(): void {
    this.listarUsuarios();
    this.cargarRoles();
  }

  listarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: (respuesta) => {
        this.usuariosLista = respuesta.data;
        this.usuariosFiltrados = [...this.usuariosLista];
        this.totalActivos = this.usuariosLista.filter(u => u.estado === true).length;
        this.totalAdministradores = this.usuariosLista.filter(u => u.nombreRol === 'ADMINISTRADOR').length;
        this.totalAlumnos = this.usuariosLista.filter(u => u.nombreRol === 'ALUMNO').length;
        this.totalChoferes = this.usuariosLista.filter(u => u.nombreRol === 'CHOFER').length;
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

  cargarRoles(): void {

    this.rolService.listar().subscribe({

        next: (response) => {

            this.roles = response.data;

            console.log("Roles:", this.roles);

        },

        error: (err) => {

            console.error(err);

        }

    });

}

  filtrarUsuarios(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroTexto = texto;
    this.aplicarFiltros();
  }

  cambiarFiltroRol(event: Event): void {
    this.filtroRol = (event.target as HTMLSelectElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuariosLista.filter(usuario => {
      const nombre = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
      const codigo = usuario.codigo.toLowerCase();
      const coincideTexto = nombre.includes(this.filtroTexto) || codigo.includes(this.filtroTexto);
      const coincideRol = this.filtroRol === 'TODOS' || usuario.nombreRol === this.filtroRol;
      return coincideTexto && coincideRol;
    });
  }

abrirModalCrear(): void {

    this.usuarioEnEdicion = null;

    this.form = {

        codigo: '',

        nombres: '',

        apellidos: '',

        correo: '',

        telefono: '',

        idRol: this.roles.length
            ? this.roles[0].idRol
            : undefined,

        estado: true

    };

    this.mostrarModal = true;

}
  editarUsuario(usuario: Usuario): void {
    this.usuarioEnEdicion = usuario;
    this.form = { ...usuario };
    this.mostrarModal = true;
  }

cerrarModal(): void {

    this.mostrarModal = false;

    this.usuarioEnEdicion = null;

    this.form = {

        codigo: '',

        nombres: '',

        apellidos: '',

        correo: '',

        telefono: '',

        idRol: this.roles.length
            ? this.roles[0].idRol
            : undefined,

        estado: true

    };

}

guardarUsuario(): void {

    if (this.usuarioEnEdicion?.idUsuario) {

        this.usuarioService.actualizar(
            this.usuarioEnEdicion.idUsuario,
            this.form
        ).subscribe({

            next: () => {

                this.cerrarModal();

                this.listarUsuarios();

                Swal.fire({

                    icon:'success',

                    title:'Usuario actualizado',

                    text:'Se actualizó correctamente.',

                    timer:1800,

                    showConfirmButton:false

                });

            },

            error:(error)=>{

                Swal.fire({

                    icon:'error',

                    title:'Error',

                    text:error.error?.message

                });

            }

        });

    }else{

        this.usuarioService.guardar(this.form).subscribe({

            next:()=>{

                this.cerrarModal();

                this.listarUsuarios();

                Swal.fire({

                    icon:'success',

                    title:'Usuario registrado',

                    text:'Registro exitoso.',

                    timer:1800,

                    showConfirmButton:false

                });

            },

            error:(error)=>{

                Swal.fire({

                    icon:'error',

                    title:'Error',

                    text:error.error?.message

                });

            }

        });

    }

}

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
