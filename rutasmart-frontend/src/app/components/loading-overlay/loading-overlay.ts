import { Component, inject } from '@angular/core';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.css'
})
export class LoadingOverlayComponent {
  protected readonly loading = inject(LoadingService);
}
