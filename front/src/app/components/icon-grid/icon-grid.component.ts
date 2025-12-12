import { Component, OnInit, OnDestroy, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { IconItemComponent } from '../icon-item/icon-item.component';
import { IconFormComponent } from '../icon-form/icon-form.component';
import { IconService } from '../../services/icon.service';
import { NavigationService } from '../../services/navigation.service';
import { Icon } from '../../models/icon.model';
import { folderTransition } from '../../animations/folder-transition.animations';

@Component({
  selector: 'app-icon-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    IconItemComponent,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './icon-grid.component.html',
  styleUrls: ['./icon-grid.component.scss'],
  animations: [folderTransition]
})
export class IconGridComponent implements OnInit, OnDestroy {
  private iconService = inject(IconService);
  private navigationService = inject(NavigationService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  @Input() editMode = false;

  icons: Icon[] = [];
  isLoading = true;
  error: string | null = null;
  animationState: 'visible' | 'hidden' = 'visible'; // For animation control
  currentFolder: Icon | null = null;

  /**
   * Get icons of type 'link' sorted by position
   */
  get linkIcons(): Icon[] {
    return this.icons.filter(icon => icon.type === 'link').sort((a, b) => a.position - b.position);
  }

  /**
   * Get icons of type 'folder' sorted by position
   */
  get folderIcons(): Icon[] {
    return this.icons.filter(icon => icon.type === 'folder').sort((a, b) => a.position - b.position);
  }

  /**
   * Get all icons sorted by category (links first, then folders)
   * Used for drag & drop operations
   */
  get sortedIcons(): Icon[] {
    return [...this.linkIcons, ...this.folderIcons];
  }


  ngOnInit(): void {
    // Subscribe to navigation changes
    this.navigationService.getCurrentFolder()
      .pipe(takeUntil(this.destroy$))
      .subscribe(folder => {
        this.currentFolder = folder;
        this.loadIconsWithAnimation(folder);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load icons with fade animation
   */
  private async loadIconsWithAnimation(folder: Icon | null): Promise<void> {
    // Fade out
    this.animationState = 'hidden';
    await this.delay(200); // Wait for fade-out animation

    // Load icons
    this.loadIcons(folder);
  }

  /**
   * Load icons from the API based on current folder
   */
  loadIcons(folder?: Icon | null): void {
    // If no folder provided, use current folder
    if (folder === undefined) {
      folder = this.currentFolder;
    }

    this.isLoading = true;
    this.error = null;

    const parentId = folder?.id;

    this.iconService.getIcons(parentId).subscribe({
      next: (icons) => {
        this.icons = (icons || []).sort((a, b) => a.position - b.position);
        this.isLoading = false;
        this.animationState = 'visible'; // Fade in
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading icons:', err);
        this.error = 'Failed to load icons. Please try again.';
        this.isLoading = false;
        this.animationState = 'visible';
        this.icons = [];
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Delay helper for animations
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle folder click - navigate into folder
   */
  onFolderClick(icon: Icon): void {
    if (this.editMode) {
      return; // Don't navigate in edit mode
    }
    this.navigationService.navigateToFolder(icon);
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
        this.loadIcons(this.currentFolder);
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

  /**
   * Handle drag and drop reordering for links
   */
  onDropLinks(event: CdkDragDrop<Icon[]>): void {
    if (!this.editMode) {
      return;
    }

    // Store original order
    const originalIcons = [...this.icons];

    // Work with link icons
    const links = [...this.linkIcons];
    moveItemInArray(links, event.previousIndex, event.currentIndex);

    // Combine with folders to create full sorted list
    const sorted = [...links, ...this.folderIcons];

    // Update positions for ALL icons (links + folders)
    const updates = sorted.map((icon, index) => ({
      id: icon.id!,
      position: index
    }));

    // Update local icons array
    this.icons = this.icons.map(icon => {
      const update = updates.find(u => u.id === icon.id);
      return update ? { ...icon, position: update.position } : icon;
    });

    // Save to API
    this.saveReorder(updates, originalIcons);
  }

  /**
   * Handle drag and drop reordering for folders
   */
  onDropFolders(event: CdkDragDrop<Icon[]>): void {
    if (!this.editMode) {
      return;
    }

    // Store original order
    const originalIcons = [...this.icons];

    // Work with folder icons
    const folders = [...this.folderIcons];
    moveItemInArray(folders, event.previousIndex, event.currentIndex);

    // Combine with links to create full sorted list
    const sorted = [...this.linkIcons, ...folders];

    // Update positions for ALL icons (links + folders)
    const updates = sorted.map((icon, index) => ({
      id: icon.id!,
      position: index
    }));

    // Update local icons array
    this.icons = this.icons.map(icon => {
      const update = updates.find(u => u.id === icon.id);
      return update ? { ...icon, position: update.position } : icon;
    });

    // Save to API
    this.saveReorder(updates, originalIcons);
  }

  /**
   * Save reordering to API
   */
  private saveReorder(updates: { id: number; position: number }[], originalIcons: Icon[]): void {
    this.iconService.reorderIcons(updates).subscribe({
      next: () => {
        this.snackBar.open('Ordre sauvegardé', 'OK', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error reordering icons:', err);
        // Revert to original order on error
        this.icons = originalIcons;
        this.snackBar.open('Erreur de sauvegarde', 'OK', { duration: 3000 });
        this.cdr.detectChanges();
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
