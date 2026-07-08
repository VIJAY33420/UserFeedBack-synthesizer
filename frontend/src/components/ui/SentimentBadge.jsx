import React from 'react';
import { cn } from '../../utils/cn';

export const SentimentBadge = ({ sentiment, score }) => {
  const isPositive = sentiment === 'Positive' || (score !== undefined && score > 0);
  const isNegative = sentiment === 'Negative' || (score !== undefined && score < 0);
  
  // Score is a raw integer from the sentiment library (e.g. -3, 0, 5), not a 0-1 float
  const displayScore = score !== undefined ? (score > 0 ? `+${score}` : `${score}`) : '';
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded text-xs font-medium border",
      isPositive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
      isNegative ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
      "bg-amber-500/10 text-amber-500 border-amber-500/20"
    )}>
      {sentiment} {displayScore ? `(${displayScore})` : ''}
    </span>
  );
};
