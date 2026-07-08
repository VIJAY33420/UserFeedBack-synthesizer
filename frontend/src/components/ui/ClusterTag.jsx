import React from 'react';

export const ClusterTag = ({ cluster }) => {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
      {cluster}
    </span>
  );
};
