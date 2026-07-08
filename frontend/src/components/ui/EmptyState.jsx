import React from 'react';
import { cn } from '../../utils/cn';

export const EmptyState = ({ icon: Icon, title, message, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="h-16 w-16 rounded-full bg-panel flex items-center justify-center mb-4 text-textMuted shadow-sm border border-borderLight">
        {Icon && <Icon size={32} />}
      </div>
      <h3 className="text-lg font-medium text-textMain mb-2">{title}</h3>
      <p className="text-textMuted max-w-sm mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
