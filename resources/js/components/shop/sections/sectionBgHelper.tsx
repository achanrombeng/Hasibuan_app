import { SectionBgConfig } from '@/types/shop';
import React from 'react';

/**
 * Calculate perceived luminance of a hex color to determine if it's dark
 */
export function isColorDark(hexColor?: string): boolean {
  if (!hexColor) return false;
  let color = hexColor.trim().replace('#', '');
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (color.length !== 6) return false;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  // Perceived brightness formula (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 135;
}

/**
 * Determine if text should be light-colored (white/cream) for optimal contrast
 */
export function isDarkTheme(config?: SectionBgConfig, defaultIsDark = false): boolean {
  if (!config || config.type === 'default') return defaultIsDark;
  if (config.text_theme === 'light') return true;
  if (config.text_theme === 'dark') return false;

  if (config.type === 'color') {
    return isColorDark(config.color);
  }

  if (config.type === 'image') {
    // If overlay is 30% or more, default to light text over photo
    return (config.overlay ?? 40) >= 30;
  }

  return defaultIsDark;
}

/**
 * Generate inline style object for section container
 */
export function getSectionBgStyles(config?: SectionBgConfig): React.CSSProperties {
  if (!config || config.type === 'default') return {};

  if (config.type === 'color' && config.color) {
    return {
      backgroundColor: config.color,
    };
  }

  if (config.type === 'image' && config.image) {
    return {
      backgroundImage: `url("${config.image}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  return {};
}

/**
 * Overlay layer for image backgrounds to guarantee text legibility
 */
export const SectionBgOverlay: React.FC<{ config?: SectionBgConfig }> = ({
  config,
}) => {
  if (!config || config.type !== 'image' || !config.image) return null;
  const opacity = (config.overlay ?? 40) / 100;

  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
      style={{
        backgroundColor: '#000000',
        opacity,
      }}
      aria-hidden="true"
    />
  );
};
