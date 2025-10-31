// src/components/icons/ArrowLeftIcon.tsx
import type { SVGProps } from 'react';

/**
 * @description Иконка "Стрелка влево".
 */
export const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
    </svg>
);