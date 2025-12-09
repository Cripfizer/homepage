import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { IconItemComponent } from '../icon-item/icon-item.component';
import { IconService } from '../../services/icon.service';
import { Icon } from '../../models/icon.model';

@Component({
  selector: 'app-icon-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    IconItemComponent
  ],
  templateUrl: './icon-grid.component.html',
  styleUrls: ['./icon-grid.component.scss']
})
export class IconGridComponent implements OnInit {
  private iconService = inject(IconService);
  private cdr = inject(ChangeDetectorRef);

  icons: Icon[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadIcons();
  }

  /**
   * Load root-level icons from the API
   */
  loadIcons(): void {
    this.isLoading = true;
    this.error = null;

    console.log('Loading icons...');
    this.iconService.getIcons().subscribe({
      next: (icons) => {
        console.log('Icons received:', icons);
        this.icons = (icons || []).sort((a, b) => a.position - b.position);
        this.isLoading = false;
        console.log('Loading complete, isLoading:', this.isLoading, 'icons count:', this.icons.length);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading icons:', err);
        this.error = 'Failed to load icons. Please try again.';
        this.isLoading = false;
        this.icons = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handle folder click (will be implemented in Sprint 4)
   */
  onFolderClick(icon: Icon): void {
    console.log('Folder clicked:', icon.title);
    // Navigation will be implemented in Sprint 4
  }

  /**
   * Handle add new button click (will be implemented in Sprint 3)
   */
  onAddNewClick(): void {
    console.log('Add new clicked');
    // Create/edit functionality will be implemented in Sprint 3
  }
}
