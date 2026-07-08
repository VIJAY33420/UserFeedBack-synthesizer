import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className={cn('bg-borderLight rounded-md', className)}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="glass-panel p-6 space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);
