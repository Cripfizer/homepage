import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IconService } from '../../services/icon.service';
import { NavigationService } from '../../services/navigation.service';
import { Icon } from '../../models/icon.model';
import { environment } from '../../../environments/environment';

export interface IconFormDialogData {
  mode: 'create' | 'edit';
  icon?: Icon;
}

@Component({
  selector: 'app-icon-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './icon-form.component.html',
  styleUrls: ['./icon-form.component.scss']
})
export class IconFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private iconService = inject(IconService);
  private navigationService = inject(NavigationService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  public dialogRef = inject(MatDialogRef<IconFormComponent>);
  public data = inject<IconFormDialogData>(MAT_DIALOG_DATA);

  iconForm!: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
    this.setupUrlValidation();
  }

  private initializeForm(): void {
    const icon = this.data.icon;

    // If icon has an image, default to upload mode, otherwise material
    const defaultIconSource = icon?.imageUrl ? 'upload' : 'material';

    this.iconForm = this.fb.group({
      title: [icon?.title || '', [Validators.required, Validators.maxLength(50)]],
      type: [icon?.type || 'link', Validators.required],
      url: [icon?.url || '', []],
      backgroundColor: [icon?.backgroundColor || '#4285F4', Validators.required],
      iconColor: [icon?.iconColor || '#FFFFFF', Validators.required],
      iconSource: [defaultIconSource, Validators.required],
      materialIconName: [icon?.materialIconName || (icon?.type === 'folder' ? 'folder' : 'link')],
      imageFile: [null]
    });

    // Set initial URL validation based on type
    this.updateUrlValidation(this.iconForm.get('type')?.value);
  }

  private setupUrlValidation(): void {
    this.iconForm.get('type')?.valueChanges.subscribe(type => {
      this.updateUrlValidation(type);
    });
  }

  private updateUrlValidation(type: string): void {
    const urlControl = this.iconForm.get('url');
    if (type === 'link') {
      urlControl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
    } else {
      urlControl?.clearValidators();
    }
    urlControl?.updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.iconForm.patchValue({ imageFile: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.iconForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const formValue = this.iconForm.value;

    // Use async function inside to handle the promises
    (async () => {
      try {
        const iconData: Partial<Icon> = {
          title: formValue.title,
          type: formValue.type,
          url: formValue.url || null,
          backgroundColor: formValue.backgroundColor,
          iconColor: formValue.iconColor
        };

        // Handle icon source
        if (formValue.iconSource === 'material') {
          // Use material icon
          iconData.materialIconName = formValue.materialIconName;
        } else if (formValue.iconSource === 'upload') {
          // If uploading a new file, clear material icon name
          if (this.selectedFile) {
            iconData.materialIconName = undefined;
          }
          // If editing without new file, preserve existing materialIconName to keep the image
          else if (this.data.mode === 'edit' && this.data.icon?.materialIconName !== undefined) {
            iconData.materialIconName = this.data.icon.materialIconName;
          }
          // For create mode without file
          else {
            iconData.materialIconName = undefined;
          }
        }

        // For create mode, set parent to current folder if inside one
        if (this.data.mode === 'create') {
          const currentFolder = this.navigationService.getCurrentFolderValue();
          if (currentFolder && currentFolder.id) {
            // Use IRI format for parent
            iconData.parent = `/api/icons/${currentFolder.id}`;
          } else {
            iconData.parent = null; // Root level
          }
        }

        // For edit mode, preserve the position and parent
        if (this.data.mode === 'edit' && this.data.icon) {
          iconData.position = this.data.icon.position;
          iconData.parent = this.data.icon.parent;
        }

        let savedIcon: Icon;

        if (this.data.mode === 'create') {
          savedIcon = await this.iconService.createIcon(iconData as Icon).toPromise() as Icon;
        } else {
          const iconId = this.data.icon!.id!;
          savedIcon = await this.iconService.updateIcon(iconId, iconData).toPromise() as Icon;
        }

        // Upload image if file selected
        if (formValue.iconSource === 'upload' && this.selectedFile && savedIcon.id) {
          savedIcon = await this.iconService.uploadImage(savedIcon.id, this.selectedFile).toPromise() as Icon;
        }

        this.snackBar.open(
          this.data.mode === 'create' ? 'Icône créée avec succès' : 'Icône modifiée avec succès',
          'Fermer',
          { duration: 3000 }
        );

        this.dialogRef.close(true);
      } catch (error: any) {
        console.error('Error saving icon:', error);
        console.error('Error details:', error.error);

        let errorMessage = 'Une erreur est survenue';
        if (error.status === 401) {
          errorMessage = 'Session expirée, veuillez vous reconnecter';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur';
        } else if (error.status === 422) {
          // Try to extract validation errors
          if (error.error?.violations) {
            const violations = error.error.violations.map((v: any) => v.message).join(', ');
            errorMessage = `Erreur de validation: ${violations}`;
          } else {
            errorMessage = 'Données invalides. Veuillez vérifier les champs du formulaire';
          }
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    })();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
