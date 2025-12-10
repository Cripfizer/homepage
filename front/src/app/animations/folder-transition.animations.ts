import { trigger, state, transition, style, animate } from '@angular/animations';

/**
 * Folder transition animation for smooth icon grid transitions
 * when navigating between folders.
 *
 * Usage: Add [@folderTransition]="animationState" to the container element
 *
 * Example:
 * <div class="icon-grid" [@folderTransition]="'visible'">
 *   <!-- content -->
 * </div>
 */
export const folderTransition = trigger('folderTransition', [
  state('hidden', style({
    opacity: 0,
    transform: 'translateX(-50px)'
  })),
  state('visible', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  transition('hidden => visible', [
    animate('200ms ease-out')
  ]),
  transition('visible => hidden', [
    animate('200ms ease-in')
  ]),
  // Fallback for initial state
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateX(-50px)'
    }),
    animate('200ms ease-out', style({
      opacity: 1,
      transform: 'translateX(0)'
    }))
  ])
]);

/**
 * Fade animation for simple fade in/out effects
 */
export const fadeAnimation = trigger('fadeAnimation', [
  state('hidden', style({ opacity: 0 })),
  state('visible', style({ opacity: 1 })),
  transition('hidden => visible', animate('300ms ease-out')),
  transition('visible => hidden', animate('200ms ease-in'))
]);
