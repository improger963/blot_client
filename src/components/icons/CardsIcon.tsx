// src/components/icons/CardsIcon.tsx
import type { SVGProps } from 'react';

export const CardsIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
        <path d="M7 2v20" />
        <path d="M17 2v20" />
        <path d="M2 12h20" />
    </svg>
);
