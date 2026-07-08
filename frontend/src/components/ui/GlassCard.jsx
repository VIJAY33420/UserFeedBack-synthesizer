import React from 'react';
import { cn } from '../../utils/cn';

export const GlassCard = ({ children, className, variant = 'default', interactive = false, ...props }) => {
  const baseClasses = variant === 'nested' ? 'glass-nested' : 'glass-panel';
  const hoverClasses = interactive ? 'glass-panel-hover cursor-pointer' : '';

  return (
    <div className={cn(baseClasses, hoverClasses, className)} {...props}>
      {children}
    </div>
  );
};
