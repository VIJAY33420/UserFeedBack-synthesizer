import React from 'react';
import { cn } from '../../utils/cn';

export const ActionTag = ({ action }) => {
  let styles = "";
  switch(action) {
    case 'Fix Now':
      styles = "bg-rose-500/10 text-rose-500 border-rose-500/20";
      break;
    case 'Research':
      styles = "bg-amber-500/10 text-amber-500 border-amber-500/20";
      break;
    case 'Nice to Have':
      styles = "bg-cyan-400/10 text-cyan-400 border-cyan-400/20";
      break;
    case 'Low Priority':
    default:
      styles = "bg-textMuted/10 text-textMuted border-borderLight";
      break;
  }

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider", styles)}>
      {action}
    </span>
  );
};
