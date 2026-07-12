import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolService, Rol } from '../../service/rol';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent implements OnInit {

  private rolService = inject(RolService);

  roles: Rol[] = [];

  readonly apiDocsUrl = 'http://localhost:8080/api-docs';
  readonly swaggerUrl = 'http://localhost:8080/swagger';

  ngOnInit(): void {
    this.rolService.listar().subscribe({
      next: (respuesta) => this.roles = respuesta.data,
      error: (err) => console.error(err)
    });
  }

}
