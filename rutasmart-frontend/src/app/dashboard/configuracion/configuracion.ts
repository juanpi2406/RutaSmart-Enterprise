import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolService, Rol } from '../../service/rol';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeSettings } from '../../service/theme.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent implements OnInit {

  private rolService = inject(RolService);
  private cdr = inject(ChangeDetectorRef);
  private themeService = inject(ThemeService);

  roles: Rol[] = [];
  tema: ThemeSettings = this.themeService.obtener();

  readonly apiDocsUrl = 'https://rutasmart-enterprise-production.up.railway.app/api-docs';
  readonly swaggerUrl = 'https://rutasmart-enterprise-production.up.railway.app/swagger';

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  aplicarTema(): void {
    this.themeService.aplicar(this.tema);
  }

  restablecerTema(): void {
    this.tema = this.themeService.restablecer();
  }

}
