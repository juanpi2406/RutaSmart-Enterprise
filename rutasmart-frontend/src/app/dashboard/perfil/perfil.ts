import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario';
import { SessionService } from '../../service/session';
import { ThemeService, ThemeSettings } from '../../service/theme.service';
import { PreferencesService, UserPreferences } from '../../service/preferences.service';
import { AlumnoService } from '../../service/alumno';
import { ChoferService } from '../../service/chofer';
import { Alumno } from '../../models/alumno';
import { ChoferResponse } from '../../models/chofer';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

type TabPerfil = 'datos' | 'seguridad' | 'apariencia' | 'preferencias';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['../alumno-shared.css', '../reservas/reservas.css', './perfil.css']
})
export class PerfilComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  session = inject(SessionService);
  private themeService = inject(ThemeService);
  private preferencesService = inject(PreferencesService);
  private alumnoService = inject(AlumnoService);
  private choferService = inject(ChoferService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cargando = false;
  guardando = false;
  usuario: Usuario | null = null;
  alumno: Alumno | null = null;
  chofer: ChoferResponse | null = null;
  form: Partial<Usuario> = {};

  tabActiva: TabPerfil = 'datos';
  tema: ThemeSettings = this.themeService.obtener();
  preferencias: UserPreferences = this.preferencesService.obtener();

  passwordActual = '';
  passwordNueva = '';
  passwordConfirmar = '';

  coloresAvatar = ['#dc2626', '#2563eb', '#7c3aed', '#059669', '#d97706', '#db2777'];
  coloresTema = [
    { nombre: 'UTP Rojo', principal: '#dc2626', secundario: '#991b1b' },
    { nombre: 'Azul', principal: '#2563eb', secundario: '#1d4ed8' },
    { nombre: 'Verde', principal: '#059669', secundario: '#047857' },
    { nombre: 'Violeta', principal: '#7c3aed', secundario: '#6d28d9' }
  ];

  ngOnInit(): void {
    this.cargarPerfil();
  }

  get rol(): string {
    return this.session.obtenerRol() || this.usuario?.nombreRol || '';
  }

  cambiarTab(tab: TabPerfil): void {
    this.tabActiva = tab;
    this.cdr.markForCheck();
  }

  cargarPerfil(): void {
    this.cargando = true;
    const sesion = this.session.obtener();
    if (!sesion?.idUsuario) {
      this.cargando = false;
      return;
    }

    this.usuarioService.buscarPorId(sesion.idUsuario).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta.data;
        this.form = { ...this.usuario };
        this.cargarDatosRol(sesion.idUsuario);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  private cargarDatosRol(idUsuario: number): void {
    if (this.rol === 'ALUMNO') {
      this.alumnoService.buscarPorUsuario(idUsuario).subscribe({
        next: (data) => {
          this.alumno = data;
          this.cdr.markForCheck();
        },
        error: () => undefined
      });
    }
    if (this.rol === 'CHOFER') {
      this.choferService.obtenerPorUsuario(idUsuario).subscribe({
        next: (resp) => {
          this.chofer = resp.data;
          this.cdr.markForCheck();
        },
        error: () => undefined
      });
    }
  }

  guardarPerfil(): void {
    if (!this.usuario || this.guardando) return;
    this.guardando = true;

    const dto: Partial<Usuario> = {
      codigo: this.usuario.codigo,
      nombres: this.form.nombres,
      apellidos: this.form.apellidos,
      correo: this.form.correo,
      telefono: this.form.telefono,
      idRol: this.usuario.idRol,
      estado: this.usuario.estado
    };

    this.usuarioService.actualizar(this.usuario.idUsuario, dto).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta.data;
        const sesion = this.session.obtener();
        this.session.guardar({
          ...sesion,
          nombres: this.usuario!.nombres,
          apellidos: this.usuario!.apellidos,
          correo: this.usuario!.correo
        });
        this.guardando = false;
        this.cdr.markForCheck();
        Swal.fire({ icon: 'success', title: 'Datos actualizados', timer: 1600, showConfirmButton: false });
      },
      error: (error) => {
        this.guardando = false;
        this.cdr.markForCheck();
        Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message });
      }
    });
  }

  cambiarPassword(): void {
    if (!this.usuario) return;
    if (!this.passwordNueva || this.passwordNueva.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Contraseña débil', text: 'Usa al menos 6 caracteres.' });
      return;
    }
    if (this.passwordNueva !== this.passwordConfirmar) {
      Swal.fire({ icon: 'warning', title: 'No coinciden', text: 'La confirmación no coincide.' });
      return;
    }

    const dto: Partial<Usuario> & { password?: string } = {
      codigo: this.usuario.codigo,
      nombres: this.usuario.nombres,
      apellidos: this.usuario.apellidos,
      correo: this.usuario.correo,
      telefono: this.usuario.telefono,
      idRol: this.usuario.idRol,
      estado: this.usuario.estado,
      password: this.passwordNueva
    };

    this.usuarioService.actualizar(this.usuario.idUsuario, dto).subscribe({
      next: () => {
        this.passwordActual = '';
        this.passwordNueva = '';
        this.passwordConfirmar = '';
        Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 1600, showConfirmButton: false });
      },
      error: (error) => {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error?.message ?? 'No se pudo cambiar la contraseña.' });
      }
    });
  }

  aplicarTema(preset?: { principal: string; secundario: string }): void {
    if (preset) {
      this.tema.colorPrincipal = preset.principal;
      this.tema.colorSecundario = preset.secundario;
    }
    this.themeService.aplicar(this.tema);
    Swal.fire({ icon: 'success', title: 'Tema aplicado', timer: 1200, showConfirmButton: false });
  }

  restablecerTema(): void {
    this.tema = this.themeService.restablecer();
    Swal.fire({ icon: 'info', title: 'Tema restablecido', timer: 1200, showConfirmButton: false });
  }

  seleccionarAvatar(color: string): void {
    this.preferencias.avatarColor = color;
    this.preferencias = this.preferencesService.guardar({ avatarColor: color });
    this.cdr.markForCheck();
  }

  guardarPreferencias(): void {
    this.preferencias = this.preferencesService.guardar(this.preferencias);
    Swal.fire({ icon: 'success', title: 'Preferencias guardadas', timer: 1400, showConfirmButton: false });
  }

  restablecerPreferencias(): void {
    this.preferencias = this.preferencesService.restablecer();
    this.cdr.markForCheck();
    Swal.fire({ icon: 'info', title: 'Preferencias restablecidas', timer: 1400, showConfirmButton: false });
  }

  cerrarSesion(): void {
    this.session.eliminar();
    this.router.navigate(['/login']);
  }

  iniciales(): string {
    const n = `${this.usuario?.nombres ?? ''} ${this.usuario?.apellidos ?? ''}`.trim();
    const partes = n.split(/\s+/).filter(Boolean);
    if (partes.length === 0) return 'RS';
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  avatarStyle(): Record<string, string> {
    return { background: `linear-gradient(135deg, ${this.preferencias.avatarColor}, ${this.tema.colorSecundario})` };
  }

  iconoRol(): string {
    switch (this.rol) {
      case 'ADMINISTRADOR': return 'bi-shield-lock-fill';
      case 'CHOFER': return 'bi-person-badge-fill';
      case 'ALUMNO': return 'bi-mortarboard-fill';
      default: return 'bi-person-fill';
    }
  }
}
