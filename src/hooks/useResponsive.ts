// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { breakpoints } from '../utils/responsive';

type Breakpoint = keyof typeof breakpoints;

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  currentBreakpoint: Breakpoint;
  width: number;
  height: number;
}

const getBreakpoint = (width: number): Breakpoint => {
  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints['2xl']) return 'xl';
  return '2xl';
};

const getDeviceType = (width: number) => {
  return {
    isMobile: width < breakpoints.sm,
    isTablet: width >= breakpoints.sm && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
    isLargeDesktop: width >= breakpoints.xl
  };
};

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        currentBreakpoint: 'lg',
        width: 1024,
        height: 768
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpoint(width);
    const deviceTypes = getDeviceType(width);

    return {
      ...deviceTypes,
      currentBreakpoint: breakpoint,
      width,
      height
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = getBreakpoint(width);
      const deviceTypes = getDeviceType(width);

      setState({
        ...deviceTypes,
        currentBreakpoint: breakpoint,
        width,
        height
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
};

// Helper hooks for specific breakpoints
export const useBreakpoint = (breakpoint: Breakpoint) => {
  const { currentBreakpoint } = useResponsive();
  return currentBreakpoint === breakpoint;
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Specific breakpoint hooks
export const useIsMobile = () => useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
export const useIsTablet = () => useMediaQuery(`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`);
export const useIsDesktop = () => useMediaQuery(`(min-width: ${breakpoints.lg}px)`);

export default useResponsive;