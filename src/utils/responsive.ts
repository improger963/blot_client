// src/utils/responsive.ts
// Utility functions and constants for responsive design

// Breakpoint values
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`
} as const;

// Responsive spacing scale
export const spacing = {
  xs: '0.25rem',     // 4px
  sm: '0.5rem',      // 8px
  md: '1rem',        // 16px
  lg: '1.5rem',      // 24px
  xl: '2rem',        // 32px
  '2xl': '3rem',     // 48px
  '3xl': '4rem'      // 64px
} as const;

// Responsive text sizes
export const textSizes = {
  xs: {
    base: '0.75rem',    // 12px
    sm: '0.8125rem',    // 13px
    md: '0.875rem',     // 14px
    lg: '1rem',         // 16px
    xl: '1.125rem'      // 18px
  },
  sm: {
    base: '0.8125rem',  // 13px
    sm: '0.875rem',     // 14px
    md: '1rem',         // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem'       // 20px
  },
  md: {
    base: '0.875rem',   // 14px
    sm: '1rem',         // 16px
    md: '1.125rem',     // 18px
    lg: '1.25rem',      // 20px
    xl: '1.5rem'        // 24px
  },
  lg: {
    base: '1rem',       // 16px
    sm: '1.125rem',     // 18px
    md: '1.25rem',      // 20px
    lg: '1.5rem',       // 24px
    xl: '1.875rem'      // 30px
  }
} as const;

// Touch target sizes for better mobile UX
export const touchTargets = {
  minimum: '44px',    // Minimum recommended touch target size
  comfortable: '48px' // Comfortable touch target size
} as const;

// Responsive utility functions
export const isMobile = () => window.innerWidth < breakpoints.sm;
export const isTablet = () => window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.lg;
export const isDesktop = () => window.innerWidth >= breakpoints.lg;

// Fluid typography calculation
export const fluidText = (minSize: string, maxSize: string, minViewport: number, maxViewport: number) => {
  const slope = (parseFloat(maxSize) - parseFloat(minSize)) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + parseFloat(minSize);
  
  return `clamp(${minSize}, ${yAxisIntersection}rem + ${slope * 100}vw, ${maxSize})`;
};

// Responsive container widths
export const containerWidths = {
  xs: '100%',
  sm: `${breakpoints.sm}px`,
  md: `${breakpoints.md}px`,
  lg: `${breakpoints.lg}px`,
  xl: `${breakpoints.xl}px`,
  '2xl': `${breakpoints['2xl']}px`
} as const;

export default {
  breakpoints,
  mediaQueries,
  spacing,
  textSizes,
  touchTargets,
  isMobile,
  isTablet,
  isDesktop,
  fluidText,
  containerWidths
};