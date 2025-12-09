/**
 * Color utility functions for calculating luminance and determining contrast colors
 * Based on WCAG 2.0 guidelines for color contrast
 */

/**
 * Convert hex color to RGB values
 * @param hex - Hex color string (e.g., "#FFFFFF" or "FFFFFF")
 * @returns Object with r, g, b values (0-255)
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Parse hex to RGB
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color using WCAG formula
 * @param hexColor - Hex color string
 * @returns Luminance value between 0 (darkest) and 1 (lightest)
 */
export function calculateLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return 0;
  }

  // Convert RGB to sRGB
  const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance using WCAG formula
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determine the best contrast color (dark or light) for a given background color
 * @param backgroundColor - Background color in hex format
 * @returns Hex color string for text/icons (either dark or light)
 */
export function getContrastColor(backgroundColor: string): string {
  const luminance = calculateLuminance(backgroundColor);

  // If background is light (luminance > 0.5), use dark text
  // If background is dark (luminance <= 0.5), use light text
  return luminance > 0.5 ? '#212121' : '#FFFFFF';
}

/**
 * Determine if dark icons should be used on the given background
 * @param backgroundColor - Background color in hex format
 * @returns True if background is light (use dark icons), false if dark (use light icons)
 */
export function shouldUseDarkIcon(backgroundColor: string): boolean {
  const luminance = calculateLuminance(backgroundColor);
  return luminance > 0.5;
}
