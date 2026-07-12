import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="dashboard">
      <div class="page-title">
        <div><h2>Ajustes del Sistema</h2><p>Administra tu perfil, preferencias y seguridad.</p></div>
        <button class="btn-primary" (click)="guardar()"><i class="bi bi-check-circle-fill"></i> Guardar Cambios</button>
      </div>

      <div class="config-grid">
        <div class="panel perfil-card">
          <h2>{{ usuario?.name }}</h2>
          <p>{{ usuario?.role }}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid var(--line);">
          <div class="input-group" style="text-align:left;">
            <label>Nombre completo:</label><input [(ngModel)]="nombre">
          </div>
          <div class="input-group" style="text-align:left;">
            <label>Correo electrónico:</label><input [(ngModel)]="correo">
          </div>
          <div class="input-group" style="text-align:left;">
            <label>Rol:</label>
            <select [(ngModel)]="rol">
              <option>ADMINISTRADOR</option><option>CHOFER</option><option>ALUMNO</option>
            </select>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title"><h3><i class="bi bi-sliders"></i> Preferencias</h3></div>
          <div class="pref-row">
            <div><div class="label">Notificaciones</div><div class="desc">Recibir alertas en tiempo real</div></div>
            <label class="switch"><input type="checkbox" [(ngModel)]="notificaciones"><span class="slider"></span></label>
          </div>
          <div class="pref-row">
            <div><div class="label">Correos de resumen</div><div class="desc">Envío diario de reportes</div></div>
            <label class="switch"><input type="checkbox" [(ngModel)]="correos"><span class="slider"></span></label>
          </div>
          <div class="pref-row">
            <div><div class="label">Alertas de incidencias</div><div class="desc">Avisar sobre retrasos y fallas</div></div>
            <label class="switch"><input type="checkbox" [(ngModel)]="alertasIncidencias"><span class="slider"></span></label>
          </div>
          <div class="pref-row">
            <div><div class="label">Tema oscuro</div><div class="desc">Interfaz de bajo contraste</div></div>
            <label class="switch"><input type="checkbox" [(ngModel)]="temaOscuro"><span class="slider"></span></label>
          </div>
        </div>
      </div>

      <div class="panel" style="margin-top:20px;">
        <div class="panel-title"><h3><i class="bi bi-shield-lock-fill"></i> Seguridad</h3></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
          <div class="input-group"><label>Contraseña actual:</label><input type="password" [(ngModel)]="passActual"></div>
          <div class="input-group"><label>Nueva contraseña:</label><input type="password" [(ngModel)]="passNueva"></div>
          <div class="input-group"><label>Confirmar:</label><input type="password" [(ngModel)]="passConfirm"></div>
        </div>
      </div>
    </section>
  `,
})
export class ConfiguracionComponent {
  private auth = inject(AuthService);
  usuario = this.auth.user;
  avatarUrl = localStorage.getItem('rs_avatar') || 'assets/img/avatar.png';

  nombre = this.usuario()?.name ?? '';
  correo = this.usuario()?.correo ?? '';
  rol = this.usuario()?.role ?? 'ADMINISTRADOR';

  notificaciones = true; correos = true; alertasIncidencias = true; temaOscuro = false;

  passActual = ''; passNueva = ''; passConfirm = '';

  constructor() {
    const p = JSON.parse(localStorage.getItem('rs_preferencias') || 'null');
    if (p) { this.notificaciones = p.notificaciones; this.correos = p.correos; this.alertasIncidencias = p.alertasIncidencias; this.temaOscuro = p.temaOscuro; }
  }

  guardar() {
    if (this.passNueva && this.passNueva !== this.passConfirm) { alert('Las contraseñas no coinciden'); return; }
    const actualizado = { name: this.nombre, role: this.rol, correo: this.correo };
    localStorage.setItem('rs_user', JSON.stringify(actualizado));
    this.auth.user.set(actualizado);
    localStorage.setItem('rs_preferencias', JSON.stringify({
      notificaciones: this.notificaciones, correos: this.correos,
      alertasIncidencias: this.alertasIncidencias, temaOscuro: this.temaOscuro
    }));
    this.passActual = this.passNueva = this.passConfirm = '';
    alert('Configuración guardada correctamente.');
  }
}
