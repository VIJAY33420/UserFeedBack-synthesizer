import React from 'react';

export const PriorityMeter = ({ score, factors = {} }) => {
  const percentage = Math.round(score * 100);
  
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-[200px]">
      <div className="flex justify-between items-end">
        <span className="text-xs font-medium text-textMuted uppercase tracking-wider">Priority</span>
        <span className="text-lg font-bold text-violet-400 leading-none">{percentage}%</span>
      </div>
      
      <div className="flex h-2 overflow-hidden bg-panel rounded-full border border-borderLight">
        {factors.frequency > 0 && (
          <div 
            style={{ width: `${(factors.frequency * 100).toFixed(1)}%` }} 
            className="bg-cyan-400/80"
            title={`Frequency impact: ${(factors.frequency * 100).toFixed(0)}%`}
          />
        )}
        {factors.sentiment > 0 && (
          <div 
            style={{ width: `${(factors.sentiment * 100).toFixed(1)}%` }} 
            className="bg-rose-500/80 border-l border-background/20"
            title={`Negative sentiment impact: ${(factors.sentiment * 100).toFixed(0)}%`}
          />
        )}
        {factors.urgency > 0 && (
          <div 
            style={{ width: `${(factors.urgency * 100).toFixed(1)}%` }} 
            className="bg-amber-500/80 border-l border-background/20"
            title={`Urgency impact: ${(factors.urgency * 100).toFixed(0)}%`}
          />
        )}
      </div>
      
      <div className="flex justify-between text-[9px] text-textMuted">
        {factors.frequency > 0 && <span>Freq</span>}
        {factors.sentiment > 0 && <span>Sent</span>}
        {factors.urgency > 0 && <span>Urg</span>}
      </div>
    </div>
  );
};
