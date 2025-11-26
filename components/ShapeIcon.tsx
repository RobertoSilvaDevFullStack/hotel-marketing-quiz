import React from 'react';
import { Shape } from '../types';

interface ShapeIconProps {
  shape: Shape;
  className?: string;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, className = '' }) => {
  const commonClasses = `w-8 h-8 md:w-12 md:h-12 fill-current ${className}`;

  switch (shape) {
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" className={commonClasses}>
          <path d="M12 2L22 22H2L12 2Z" fill="white" />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 24 24" className={commonClasses}>
           <rect x="12" y="2" width="14" height="14" transform="rotate(45 12 2)" fill="white" />
        </svg>
      );
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className={commonClasses}>
          <circle cx="12" cy="12" r="10" fill="white" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className={commonClasses}>
          <rect x="2" y="2" width="20" height="20" fill="white" />
        </svg>
      );
    default:
      return null;
  }
};