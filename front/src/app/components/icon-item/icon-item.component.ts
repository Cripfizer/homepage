import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Icon } from '../../models/icon.model';

@Component({
  selector: 'app-icon-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './icon-item.component.html',
  styleUrls: ['./icon-item.component.scss']
})
export class IconItemComponent {
  @Input() icon!: Icon;
  @Input() editMode = false;
  @Output() folderClick = new EventEmitter<Icon>();
  @Output() editClick = new EventEmitter<Icon>();
  @Output() deleteClick = new EventEmitter<Icon>();

  /**
   * Get the icon color (user-defined color for Material icons)
   */
  getIconColor(): string {
    // Use user-defined icon color, or default to white
    return this.icon.iconColor || '#FFFFFF';
  }

  /**
   * Get the background color for the icon card
   */
  getBackgroundColor(): string {
    return this.icon.backgroundColor || '#424242';
  }

  /**
   * Handle click on the icon
   * - If type is 'link': open URL in new tab
   * - If type is 'folder': emit event for parent to handle navigation
   * - In edit mode: do nothing
   */
  onClick(): void {
    if (this.editMode) {
      return; // Disable normal click behavior in edit mode
    }

    if (this.icon.type === 'link' && this.icon.url) {
      window.open(this.icon.url, '_blank');
    } else if (this.icon.type === 'folder') {
      this.folderClick.emit(this.icon);
    }
  }

  /**
   * Handle edit button click
   */
  onEditClick(event: Event): void {
    event.stopPropagation();
    this.editClick.emit(this.icon);
  }

  /**
   * Handle delete button click
   */
  onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(this.icon);
  }

  /**
   * Get the Material icon name
   * Uses the custom icon name if set, otherwise defaults based on type
   */
  getMaterialIconName(): string {
    if (this.icon.materialIconName) {
      // Material icon names must be lowercase
      return this.icon.materialIconName.toLowerCase().trim();
    }
    // Default icons based on type
    return this.icon.type === 'folder' ? 'folder' : 'link';
  }
}
