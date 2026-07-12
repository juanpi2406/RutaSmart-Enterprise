import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <section class="dashboard">
      <div class="page-title">
        <div><h2>Gestión de Usuarios</h2><p>Administración de administradores, alumnos y choferes.</p></div>
        <button class="btn-primary" (click)="abrirNuevo()"><i class="bi bi-plus-circle"></i> Nuevo Usuario</button>
      </div>

      <section class="cards">
        <div class="card alumnos"><div><small>USUARIOS</small><h2>{{ usuarios.length }}</h2></div><i class="bi bi-people-fill"></i></div>
        <div class="card buses"><div><small>ADMINS</small><h2>{{ admins }}</h2></div><i class="bi bi-person-badge-fill"></i></div>
        <div class="card reservas"><div><small>ALUMNOS</small><h2>{{ alumnosCount }}</h2></div><i class="bi bi-mortarboard-fill"></i></div>
        <div class="card incidencias"><div><small>CHOFERES</small><h2>{{ choferes }}</h2></div><i class="bi bi-bus-front-fill"></i></div>
      </section>

      <div class="panel">
        <div class="toolbar">
          <input type="text" [(ngModel)]="filtro" (ngModelChange)="filtrar()" placeholder="Buscar usuario...">
          <select [(ngModel)]="filtroRol" (ngModelChange)="filtrar()">
            <option value="">Todos los roles</option>
            <option value="ADMINISTRADOR">Administrador</option>
            <option value="ALUMNO">Alumno</option>
            <option value="CHOFER">Chofer</option>
          </select>
        </div>
      </div>

      <div class="panel" style="margin-top:20px;">
        <div class="panel-title"><h3>Lista de Usuarios</h3></div>
        <table>
          <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            <tr *ngFor="let u of filtrados">
              <td>{{ u.id }}</td><td>{{ u.nombre }}</td><td>{{ u.correo }}</td><td>{{ u.rol }}</td>
              <td><span class="status" [ngClass]="estadoClase(u.estado)">{{ u.estado }}</span></td>
              <td>
                <button class="edit" (click)="abrirEditar(u)"><i class="bi bi-pencil-square"></i></button>
                <button class="delete" (click)="eliminar(u)"><i class="bi bi-trash-fill"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal" [class.active]="modalAbierto">
        <div class="modal-content" style="max-width:480px;text-align:left;">
          <span class="close" (click)="cerrar()">&times;</span>
          <h3>{{ editando ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
          <div class="input-group"><label>Nombre</label><input [(ngModel)]="form.nombre"></div>
          <div class="input-group"><label>Correo</label><input [(ngModel)]="form.correo"></div>
          <div class="input-group"><label>Rol</label>
            <select [(ngModel)]="form.rol"><option>ADMINISTRADOR</option><option>ALUMNO</option><option>CHOFER</option></select>
          </div>
          <div class="input-group"><label>Estado</label>
            <select [(ngModel)]="form.estado"><option>ACTIVO</option><option>VACACIONES</option><option>INACTIVO</option></select>
          </div>
          <div style="text-align:right;margin-top:15px;">
            <button class="btn-secondary" (click)="cerrar()">Cancelar</button>
            <button class="btn-primary" (click)="guardar()">Guardar</button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class UsuariosComponent {
  private svc = inject(UsuarioService);
  usuarios: Usuario[] = [];
  filtrados: Usuario[] = [];
  filtro = '';
  filtroRol = '';
  modalAbierto = false;
  editando: Usuario | null = null;
  form: Usuario = this.vacio();

  constructor() { this.cargar(); }

  cargar() {
    this.svc.listar().subscribe(u => { this.usuarios = u; this.filtrar(); });
  }
  get admins() { return this.usuarios.filter(u => u.rol === 'ADMINISTRADOR').length; }
  get alumnosCount() { return this.usuarios.filter(u => u.rol === 'ALUMNO').length; }
  get choferes() { return this.usuarios.filter(u => u.rol === 'CHOFER').length; }

  filtrar() {
    const t = this.filtro.toLowerCase();
    this.filtrados = this.usuarios.filter(u =>
      (u.nombre.toLowerCase().includes(t) || u.correo.toLowerCase().includes(t)) &&
      (!this.filtroRol || u.rol === this.filtroRol));
  }

  abrirNuevo() { this.editando = null; this.form = this.vacio(); this.modalAbierto = true; }
  abrirEditar(u: Usuario) { this.editando = u; this.form = { ...u }; this.modalAbierto = true; }
  cerrar() { this.modalAbierto = false; }

  guardar() {
    if (this.editando && this.editando.id) {
      this.svc.actualizar(this.editando.id, this.form).subscribe(() => { this.cerrar(); this.cargar(); });
    } else {
      this.svc.crear(this.form).subscribe(() => { this.cerrar(); this.cargar(); });
    }
  }

  eliminar(u: Usuario) {
    if (u.id && confirm('¿Eliminar usuario?')) this.svc.eliminar(u.id).subscribe(() => this.cargar());
  }

  estadoClase(e: string) {
    if (e === 'ACTIVO') return 'ok';
    if (e === 'VACACIONES') return 'warning';
    return 'danger';
  }
  vacio(): Usuario { return { nombre: '', correo: '', rol: 'ALUMNO', estado: 'ACTIVO' }; }
}
