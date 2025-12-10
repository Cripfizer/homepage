import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { IconGridComponent } from '../icon-grid/icon-grid.component';
import { Icon } from '../../models/icon.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, // Includes mat-button and mat-icon-button
    MatToolbarModule,
    MatIconModule,
    IconGridComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  editMode = false;
  currentFolder: Icon | null = null;
  breadcrumb: Icon[] = [];
  showBackButton = false;

  ngOnInit(): void {
    // Subscribe to navigation changes
    this.navigationService.getCurrentFolder()
      .pipe(takeUntil(this.destroy$))
      .subscribe(folder => {
        this.currentFolder = folder;
        this.showBackButton = folder !== null;
        this.breadcrumb = this.navigationService.getBreadcrumb();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  navigateBack(): void {
    this.navigationService.navigateBack();
  }

  navigateToRoot(): void {
    this.navigationService.navigateToRoot();
  }

  navigateTo(index: number): void {
    this.navigationService.navigateTo(index);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
