// src/hooks/useDeviceDetection.ts
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  isTouchDevice: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeScreen: false,
        orientation: 'landscape',
        screenWidth: 1024,
        screenHeight: 768,
        devicePixelRatio: 1,
        isTouchDevice: false
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const isLargeScreen = width >= 1440;
    const orientation = width > height ? 'landscape' : 'portrait';
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isLargeScreen,
      orientation,
      screenWidth: width,
      screenHeight: height,
      devicePixelRatio,
      isTouchDevice
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const isLargeScreen = width >= 1440;
      const orientation = width > height ? 'landscape' : 'portrait';
      const devicePixelRatio = window.devicePixelRatio || 1;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLargeScreen,
        orientation,
        screenWidth: width,
        screenHeight: height,
        devicePixelRatio,
        isTouchDevice
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
};

// Helper hooks for specific device types
export const useIsMobile = () => {
  const { isMobile } = useDeviceDetection();
  return isMobile;
};

export const useIsTablet = () => {
  const { isTablet } = useDeviceDetection();
  return isTablet;
};

export const useIsDesktop = () => {
  const { isDesktop } = useDeviceDetection();
  return isDesktop;
};

export const useIsLargeScreen = () => {
  const { isLargeScreen } = useDeviceDetection();
  return isLargeScreen;
};

export const useOrientation = () => {
  const { orientation } = useDeviceDetection();
  return orientation;
};

export const useTouchDevice = () => {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
};

export default useDeviceDetection;