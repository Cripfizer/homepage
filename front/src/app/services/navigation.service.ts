import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Icon } from '../models/icon.model';

/**
 * NavigationService manages the folder navigation state and history.
 * It tracks the current folder being viewed and maintains a navigation stack
 * for breadcrumb functionality and back navigation.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentFolderSubject = new BehaviorSubject<Icon | null>(null);
  private navigationStack: Icon[] = [];

  /**
   * Get an observable of the current folder
   * @returns Observable that emits the current folder or null if at root
   */
  getCurrentFolder(): Observable<Icon | null> {
    return this.currentFolderSubject.asObservable();
  }

  /**
   * Get the current folder value (synchronous)
   * @returns Current folder or null if at root
   */
  getCurrentFolderValue(): Icon | null {
    return this.currentFolderSubject.value;
  }

  /**
   * Navigate into a folder
   * @param folder The folder to navigate into
   */
  navigateToFolder(folder: Icon): void {
    if (folder.type !== 'folder') {
      console.warn('Attempted to navigate to a non-folder icon');
      return;
    }
    this.navigationStack.push(folder);
    this.currentFolderSubject.next(folder);
  }

  /**
   * Navigate back to the parent folder
   */
  navigateBack(): void {
    if (this.navigationStack.length === 0) {
      console.warn('Already at root level');
      return;
    }

    this.navigationStack.pop();
    const previous = this.navigationStack[this.navigationStack.length - 1] || null;
    this.currentFolderSubject.next(previous);
  }

  /**
   * Navigate to the root level (clear all navigation)
   */
  navigateToRoot(): void {
    this.navigationStack = [];
    this.currentFolderSubject.next(null);
  }

  /**
   * Get the breadcrumb trail (navigation stack)
   * @returns Array of folders representing the current path
   */
  getBreadcrumb(): Icon[] {
    return [...this.navigationStack];
  }

  /**
   * Navigate to a specific level in the breadcrumb
   * @param index The index in the navigation stack to navigate to
   */
  navigateTo(index: number): void {
    if (index < 0 || index >= this.navigationStack.length) {
      console.warn('Invalid breadcrumb index');
      return;
    }

    // Keep only the folders up to and including the target index
    this.navigationStack = this.navigationStack.slice(0, index + 1);
    const target = this.navigationStack[index];
    this.currentFolderSubject.next(target);
  }

  /**
   * Check if currently at root level
   * @returns True if at root, false otherwise
   */
  isAtRoot(): boolean {
    return this.navigationStack.length === 0;
  }
}
