import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Icon } from '../../models/icon.model';
import { getContrastColor } from '../../utils/color.utils';

@Component({
  selector: 'app-icon-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon-item.component.html',
  styleUrls: ['./icon-item.component.scss']
})
export class IconItemComponent {
  @Input() icon!: Icon;
  @Output() folderClick = new EventEmitter<Icon>();

  /**
   * Get the contrast color (text/icon color) based on the background color
   */
  getTextColor(): string {
    if (!this.icon.backgroundColor) {
      return '#FFFFFF'; // Default to white if no background color
    }
    return getContrastColor(this.icon.backgroundColor);
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
   */
  onClick(): void {
    if (this.icon.type === 'link' && this.icon.url) {
      window.open(this.icon.url, '_blank');
    } else if (this.icon.type === 'folder') {
      this.folderClick.emit(this.icon);
    }
  }

  /**
   * Get the Material icon name based on icon type
   */
  getMaterialIconName(): string {
    if (this.icon.type === 'folder') {
      return 'folder';
    }
    return 'link';
  }
}
