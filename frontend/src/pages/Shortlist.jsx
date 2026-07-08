import React from 'react';
import { useShortlist } from '../hooks/useFeedback';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { Zap, AlertTriangle, MessagesSquare, CheckCircle2 } from 'lucide-react';
import { PriorityMeter } from '../components/ui/PriorityMeter';
import { ActionTag } from '../components/ui/ActionTag';
import { SentimentBadge } from '../components/ui/SentimentBadge';
import { ClusterTag } from '../components/ui/ClusterTag';

export default function Shortlist() {
  const { data, isLoading, isError, refetch } = useShortlist();
  const items = Array.isArray(data) ? data : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center"><Zap size={20} /></div>
          The Shortlist
        </h1>
        <p className="text-textMuted">The absolute highest priority items to address, mathematically ranked.</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <GlassCard key={i} className="p-6 h-32"><Skeleton className="w-full h-full" /></GlassCard>)}
        </div>
      )}

      {isError && (
        <EmptyState 
          icon={AlertTriangle} 
          title="Couldn't load shortlist" 
          message="There was an error communicating with the API." 
          action={<button onClick={refetch} className="px-4 py-2 bg-violet-600 rounded-md text-white">Try Again</button>} 
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState 
          icon={CheckCircle2} 
          title="All caught up" 
          message="Your shortlist is completely clear right now." 
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="space-y-4 relative">
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-rose-500/50 via-violet-500/20 to-transparent hidden md:block"></div>
          
          {items.map((item) => (
            <GlassCard key={item._id} interactive className="p-0 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-amber-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6 pl-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <ActionTag action={item.actionTag} />
                      <ClusterTag cluster={item.cluster} />
                      <SentimentBadge sentiment={item.sentimentLabel} score={item.sentimentScore} />
                      {item.isDuplicateOf && (
                        <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 uppercase">
                          <MessagesSquare size={10} /> Similar
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2 leading-relaxed">"{item.text}"</h3>
                      <div className="text-sm text-textMuted flex items-center gap-3 flex-wrap">
                        <span>{item.productName}</span>
                        <span className="w-1 h-1 rounded-full bg-borderLight"></span>
                        <span>{item.source}</span>
                        <span className="w-1 h-1 rounded-full bg-borderLight"></span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-48 shrink-0 bg-background/50 rounded-xl p-4 border border-borderLight/50">
                    <PriorityMeter 
                      score={item.priorityScore} 
                      factors={{ 
                        frequency: 0.4, 
                        sentiment: item.sentimentScore < 0 ? 0.4 : 0.1, 
                        urgency: item.urgencyScore || 0.2 
                      }} 
                    />
                  </div>
                  
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
