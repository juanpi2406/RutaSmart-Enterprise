import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { ReservaService } from '../../services/reserva.service';
import { Usuario, Reserva } from '../../models';

interface MenuItem { label: string; icon: string; link: string; }
interface Noti { icon: string; texto: string; tiempo: string; leido: boolean; }
interface Mensaje { de: string; texto: string; tiempo: string; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, FormsModule, CommonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private usuarioSvc = inject(UsuarioService);
  private reservaSvc = inject(ReservaService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  user = this.auth.user;
  private readonly DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' rx='50' fill='%23155bc9'/><circle cx='50' cy='38' r='18' fill='white'/><path d='M22 92 Q50 58 78 92' fill='white'/></svg>";
  avatarUrl = localStorage.getItem('rs_avatar') || this.DEFAULT_AVATAR;

  menu: MenuItem[] = [];

  notis: Noti[] = [
    { icon: 'bi-check-circle-fill', texto: 'Reserva confirmada: Carlos Ruiz', tiempo: 'Hace 5 min', leido: false },
    { icon: 'bi-bus-front-fill', texto: 'BUS-02 inició recorrido', tiempo: 'Hace 20 min', leido: false },
    { icon: 'bi-exclamation-triangle-fill', texto: 'Incidencia: retraso en Ruta Centro', tiempo: 'Hace 1 hora', leido: false },
    { icon: 'bi-people-fill', texto: 'Nuevo alumno registrado', tiempo: 'Hace 3 horas', leido: true },
  ];

  mensajes: Mensaje[] = [
    { de: 'María Soto', texto: '¿Puedo cambiar mi reserva?', tiempo: 'Hace 10 min' },
    { de: 'Miguel Díaz', texto: 'Bus listo para la salida', tiempo: 'Hace 40 min' },
    { de: 'Supervisor', texto: 'Revisar incidencia de BUS-03', tiempo: 'Hace 2 horas' },
    { de: 'Soporte', texto: 'Bienvenido a RutaSmart', tiempo: 'Ayer' },
    { de: 'José Díaz', texto: 'Gracias por la ruta de hoy', tiempo: 'Ayer' },
  ];

  openDropdown: string = '';
  searchTerm: string = '';
  searchResults: any[] = [];
  hora: string = '';
  fecha: string = '';

  constructor() {
    const rol = this.user()?.role || 'ADMINISTRADOR';
    if (rol === 'CHOFER') {
      this.menu = [
        { label: 'Mis Viajes', icon: 'bi-geo-alt-fill', link: '/app/chofer' },
        { label: 'Mi Perfil', icon: 'bi-person-fill', link: '/app/chofer' },
        { label: 'Incidencias', icon: 'bi-exclamation-triangle-fill', link: '/app/chofer' },
      ];
    } else if (rol === 'ALUMNO') {
      this.menu = [
        { label: 'Panel', icon: 'bi-speedometer2', link: '/app/alumno' },
        { label: 'Reservas', icon: 'bi-ticket-perforated-fill', link: '/app/alumno/reservas' },
        { label: 'Historial', icon: 'bi-clock-history', link: '/app/alumno/historial' },
        { label: 'Incidencias', icon: 'bi-exclamation-triangle-fill', link: '/app/alumno/incidencias' },
      ];
    } else {
      this.menu = [
        { label: 'Dashboard', icon: 'bi-speedometer2', link: '/app/dashboard' },
        { label: 'Usuarios', icon: 'bi-people-fill', link: '/app/usuarios' },
        { label: 'Transporte', icon: 'bi-bus-front', link: '/app/transporte' },
        { label: 'Reservas', icon: 'bi-ticket-perforated-fill', link: '/app/reservas' },
        { label: 'Reportes', icon: 'bi-bar-chart-fill', link: '/app/reportes' },
        { label: 'Configuración', icon: 'bi-gear-fill', link: '/app/configuracion' },
      ];
    }
    this.actualizarReloj();
    setInterval(() => this.actualizarReloj(), 1000);
  }

  actualizarReloj() {
    const ahora = new Date();
    this.hora = ahora.toLocaleTimeString('es-PE');
    this.fecha = ahora.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  get notiNoLeidas() { return this.notis.filter(n => !n.leido).length; }

  toggle(dp: string) {
    this.openDropdown = this.openDropdown === dp ? '' : dp;
  }

  @HostListener('document:click')
  cerrarDropdowns() { this.openDropdown = ''; }

  onSearch() {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) { this.searchResults = []; return; }
    this.searchResults = [];
    this.usuarioSvc.listar().subscribe(us => {
      us.filter(u => (u.nombre + ' ' + u.correo).toLowerCase().includes(q))
        .forEach(u => this.searchResults.push({ titulo: u.nombre, sub: u.rol, url: '/app/usuarios' }));
    });
    this.reservaSvc.listar().subscribe(rs => {
      rs.filter(r => (r.alumno + ' ' + r.ruta).toLowerCase().includes(q))
        .forEach(r => this.searchResults.push({ titulo: 'Reserva: ' + r.alumno, sub: r.ruta + ' · ' + r.estado, url: '/app/reservas' }));
    });
    ['Norte', 'Sur', 'Centro'].forEach(ru => {
      if (ru.toLowerCase().includes(q)) this.searchResults.push({ titulo: 'Ruta ' + ru, sub: 'Transporte', url: '/app/transporte' });
    });
  }

  irA(url: string) {
    this.searchTerm = '';
    this.searchResults = [];
    this.openDropdown = '';
    this.router.navigate([url]);
  }

  marcarLeida(i: number) { this.notis[i].leido = true; }
  marcarTodas() { this.notis.forEach(n => (n.leido = true)); }

  editarFoto() { this.fileInput.nativeElement.click(); }

  onFotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      this.avatarUrl = ev.target?.result as string;
      localStorage.setItem('rs_avatar', this.avatarUrl);
    };
    reader.readAsDataURL(file);
  }

  logout() { this.auth.logout(); }
}
