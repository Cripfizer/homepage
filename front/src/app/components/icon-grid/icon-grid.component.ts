import { Component, OnInit, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconItemComponent } from '../icon-item/icon-item.component';
import { IconFormComponent } from '../icon-form/icon-form.component';
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
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @Input() editMode = false;

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
   * Handle add new button click
   */
  onAddNewClick(): void {
    const dialogRef = this.dialog.open(IconFormComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadIcons();
      }
    });
  }

  /**
   * Handle edit icon click
   */
  onEditClick(icon: Icon): void {
    const dialogRef = this.dialog.open(IconFormComponent, {
      width: '500px',
      data: { mode: 'edit', icon }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadIcons();
      }
    });
  }

  /**
   * Handle delete icon click
   */
  onDeleteClick(icon: Icon): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: { iconTitle: icon.title }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteIcon(icon);
      }
    });
  }

  /**
   * Delete an icon
   */
  private deleteIcon(icon: Icon): void {
    if (!icon.id) {
      return;
    }

    this.iconService.deleteIcon(icon.id).subscribe({
      next: () => {
        this.snackBar.open('Icône supprimée avec succès', 'Fermer', { duration: 3000 });
        this.loadIcons();
      },
      error: (err) => {
        console.error('Error deleting icon:', err);
        let errorMessage = 'Impossible de supprimer l\'icône';
        if (err.status === 401) {
          errorMessage = 'Session expirée, veuillez vous reconnecter';
        } else if (err.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur';
        }
        this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
      }
    });
  }
}

// Confirm delete dialog component
@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Supprimer l'icône ?</h2>
    <mat-dialog-content>
      <p>Voulez-vous vraiment supprimer <strong>"{{ data.iconTitle }}"</strong> ?</p>
      <p>Cette action est irréversible.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Annuler</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Supprimer</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px 24px;

      p {
        margin: 8px 0;
        color: rgba(255, 255, 255, 0.9);

        &:first-child {
          margin-top: 0;
        }

        strong {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  `]
})
export class ConfirmDeleteDialogComponent {
  public data = inject<{ iconTitle: string }>(MAT_DIALOG_DATA);
}
