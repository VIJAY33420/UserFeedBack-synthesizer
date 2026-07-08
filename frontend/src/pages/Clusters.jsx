import React, { useState } from 'react';
import { useClusters, useFeedbackList } from '../hooks/useFeedback';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { Hash, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { ActionTag } from '../components/ui/ActionTag';

const ClusterPanel = ({ cluster, allFeedback }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Backend aggregation returns _id as cluster name
  const clusterName = cluster._id;
  const clusterFeedback = expanded 
    ? allFeedback.filter(f => f.cluster === clusterName)
    : [];

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
            <Hash size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{clusterName}</h3>
            <p className="text-textMuted">{cluster.count} feedback items</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-textMuted uppercase mb-1">Avg Sentiment</div>
            <div className={`font-bold ${cluster.averageSentiment > 0 ? 'text-emerald-400' : cluster.averageSentiment < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
              {cluster.averageSentiment?.toFixed(1)}
            </div>
          </div>
          <div className="text-textMuted">
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-borderLight/50 bg-background/30">
          <div className="space-y-4 mt-4">
            {clusterFeedback.length > 0 ? clusterFeedback.map(f => (
              <div key={f._id} className="p-4 rounded-lg bg-panel border border-borderLight flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <ActionTag action={f.actionTag} />
                  <span className="text-xs text-textMuted">{new Date(f.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-white">"{f.text}"</p>
                <div className="text-xs text-textMuted flex gap-2">
                  <span>{f.productName}</span> • <span>Priority: {Math.round((f.priorityScore || 0) * 100)}%</span>
                </div>
              </div>
            )) : (
              <div className="text-center p-4 text-textMuted text-sm">No feedback entries found for this cluster.</div>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default function Clusters() {
  const { data: clusters, isLoading: clLoading, isError: clError, refetch } = useClusters();
  const { data: feedbackData } = useFeedbackList();
  
  const clusterArr = Array.isArray(clusters) ? clusters : [];
  const feedbackArr = Array.isArray(feedbackData) ? feedbackData : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center"><Hash size={20} /></div>
          Thematic Clusters
        </h1>
        <p className="text-textMuted">Automatically categorized groups of feedback revealing core product themes.</p>
      </div>

      {clLoading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <GlassCard key={i} className="h-24"><Skeleton className="w-full h-full" /></GlassCard>)}
        </div>
      )}

      {clError && (
        <EmptyState 
          icon={AlertTriangle} 
          title="Couldn't load clusters" 
          message="There was an error communicating with the API." 
          action={<button onClick={refetch} className="px-4 py-2 bg-violet-600 rounded-md text-white">Try Again</button>} 
        />
      )}

      {!clLoading && !clError && clusterArr.length === 0 && (
        <EmptyState 
          icon={Hash} 
          title="No themes detected" 
          message="We need more feedback to start grouping themes automatically." 
        />
      )}

      {!clLoading && !clError && clusterArr.length > 0 && (
        <div className="space-y-4">
          {clusterArr.map((cluster) => (
            <ClusterPanel key={cluster._id} cluster={cluster} allFeedback={feedbackArr} />
          ))}
        </div>
      )}
    </div>
  );
}
