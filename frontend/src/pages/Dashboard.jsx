import React from 'react';
import { useFeedbackList, useClusters, useTrend, useShortlist } from '../hooks/useFeedback';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton, CardSkeleton } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { Activity, AlertTriangle, ArrowRight, Zap, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PriorityMeter } from '../components/ui/PriorityMeter';
import { ActionTag } from '../components/ui/ActionTag';

export default function Dashboard() {
  const { data: feedbackData, isLoading: fbLoading, isError: fbError, refetch: refetchFb } = useFeedbackList();
  const { data: clustersData, isLoading: clLoading } = useClusters();
  const { data: trendData, isLoading: trLoading } = useTrend();
  const { data: shortlistData, isLoading: slLoading } = useShortlist();

  // Normalize trend data: backend returns _id as the date field
  const normalizedTrend = Array.isArray(trendData)
    ? trendData.map(t => ({ date: t._id, averageSentiment: t.averageSentiment, count: t.count }))
    : [];

  const renderStats = () => {
    if (fbLoading || clLoading) return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <GlassCard key={i} className="p-5"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-8 w-3/4" /></GlassCard>)}
      </div>
    );
    
    if (fbError) return <EmptyState icon={AlertTriangle} title="Failed to load stats" message="Ensure the backend is running." action={<button onClick={refetchFb} className="text-violet-400">Retry</button>} />;
    
    const feedbackArr = Array.isArray(feedbackData) ? feedbackData : [];
    const total = feedbackArr.length;
    const fixNowCount = feedbackArr.filter(f => f.actionTag === 'Fix Now').length;
    // Sentiment score is a raw integer (e.g. -3, 0, 5). Normalize to [-1, 1] by clamping to [-5, 5] range.
    const avgRawSentiment = total > 0 ? feedbackArr.reduce((acc, curr) => acc + (curr.sentimentScore || 0), 0) / total : 0;
    const avgSentimentNormalized = Math.max(-1, Math.min(1, avgRawSentiment / 5));
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5">
          <div className="text-sm font-medium text-textMuted mb-1">Total Feedback</div>
          <div className="text-3xl font-bold text-white">{total}</div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-sm font-medium text-textMuted mb-1">Avg Sentiment</div>
          <div className={`text-3xl font-bold ${avgSentimentNormalized > 0 ? 'text-emerald-400' : avgSentimentNormalized < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
            {avgSentimentNormalized > 0 ? '+' : ''}{(avgSentimentNormalized * 100).toFixed(0)}%
          </div>
        </GlassCard>
        <GlassCard className="p-5 border-rose-500/20 bg-rose-500/5">
          <div className="text-sm font-medium text-rose-300 mb-1">Fix Now</div>
          <div className="text-3xl font-bold text-rose-400">{fixNowCount}</div>
        </GlassCard>
        <GlassCard className="p-5 border-violet-500/20 bg-violet-500/5">
          <div className="text-sm font-medium text-violet-300 mb-1">Active Clusters</div>
          <div className="text-3xl font-bold text-violet-400">{Array.isArray(clustersData) ? clustersData.length : 0}</div>
        </GlassCard>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-textMuted">A high-level view of what your users are experiencing.</p>
      </div>
      
      {renderStats()}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-6 h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity size={18} className="text-cyan-400" /> Sentiment Trend</h3>
            {trLoading ? (
              <div className="flex-1 flex items-center justify-center"><Skeleton className="h-full w-full" /></div>
            ) : normalizedTrend.length > 0 ? (
              <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={normalizedTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#9a9aa5" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9a9aa5" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                      itemStyle={{ color: '#f1f1f4' }}
                    />
                    <Area type="monotone" dataKey="averageSentiment" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState icon={Activity} title="No trend data" message="Not enough feedback collected yet." />
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Hash size={18} className="text-violet-400"/> Cluster Breakdown</h3>
              <Link to="/clusters" className="text-sm font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1">View all <ArrowRight size={14}/></Link>
            </div>
            {clLoading ? <CardSkeleton /> : (Array.isArray(clustersData) && clustersData.length > 0) ? (
               <div className="space-y-4">
                 {clustersData.slice(0, 4).map(c => (
                   <div key={c._id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-borderLight">
                     <div>
                       <div className="font-medium text-white mb-0.5">{c._id}</div>
                       <div className="text-xs text-textMuted">{c.count} mentions</div>
                     </div>
                     <div className={`text-sm font-medium ${c.averageSentiment > 0 ? 'text-emerald-400' : c.averageSentiment < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                       {c.averageSentiment?.toFixed(1)}
                     </div>
                   </div>
                 ))}
               </div>
            ) : <EmptyState icon={Hash} title="No clusters" message="We haven't detected themes yet." />}
          </GlassCard>
        </div>
        
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={18} className="text-rose-400"/> Top Shortlist</h3>
              <Link to="/shortlist" className="text-sm font-medium text-violet-400 hover:text-violet-300 flex items-center gap-1">Expand <ArrowRight size={14}/></Link>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
              {slLoading ? (
                <><CardSkeleton /><CardSkeleton /></>
              ) : (Array.isArray(shortlistData) && shortlistData.length > 0) ? (
                shortlistData.slice(0, 3).map(item => (
                  <GlassCard key={item._id} variant="nested" className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <ActionTag action={item.actionTag} />
                      <div className="text-xs text-textMuted">{item.productName}</div>
                    </div>
                    <p className="text-sm text-white line-clamp-3 leading-relaxed">{item.text}</p>
                    <div className="pt-2 mt-auto border-t border-borderLight">
                      <PriorityMeter score={item.priorityScore} factors={{ frequency: 0.4, sentiment: 0.4, urgency: 0.2 }} />
                    </div>
                  </GlassCard>
                ))
              ) : (
                <EmptyState icon={Zap} title="Shortlist is empty" message="Submit feedback to generate prioritized tasks." className="my-auto" />
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
