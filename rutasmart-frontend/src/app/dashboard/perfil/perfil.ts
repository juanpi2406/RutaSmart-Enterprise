import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../service/usuario';
import { SessionService } from '../../service/session';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private session = inject(SessionService);

  cargando = false;
  usuario: Usuario | null = null;
  form: Partial<Usuario> = {};

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    const sesion = this.session.obtener();

    if (!sesion) {
      this.cargando = false;
      return;
    }

    this.usuarioService.buscarPorId(sesion.idUsuario).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta.data;
        this.form = { ...this.usuario };
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }

  guardarPerfil(): void {

    if (!this.usuario) return;

    const dto: Partial<Usuario> = {
      ...this.usuario,
      nombres: this.form.nombres,
      apellidos: this.form.apellidos,
      correo: this.form.correo,
      telefono: this.form.telefono
    };

    this.usuarioService.actualizar(this.usuario.idUsuario, dto).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta.data;

        const sesion = this.session.obtener();
        this.session.guardar({
          ...sesion,
          nombres: this.usuario.nombres,
          apellidos: this.usuario.apellidos,
          correo: this.usuario.correo
        });

        Swal.fire({
          icon: 'success',
          title: 'Perfil actualizado',
          text: 'Tus datos se actualizaron correctamente.',
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
