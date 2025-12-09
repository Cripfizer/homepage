import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { IconGridComponent } from '../icon-grid/icon-grid.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    IconGridComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  editMode = false;

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
