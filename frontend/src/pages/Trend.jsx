import React from 'react';
import { useTrend } from '../hooks/useFeedback';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { BarChart2, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Trend() {
  const { data, isLoading, isError, refetch } = useTrend();

  // Normalize: backend returns _id as date field
  const normalizedData = Array.isArray(data)
    ? data.map(t => ({ date: t._id, averageSentiment: t.averageSentiment, count: t.count }))
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-400/20 text-cyan-400 flex items-center justify-center"><BarChart2 size={20} /></div>
          Sentiment Trend
        </h1>
        <p className="text-textMuted">Monitor how user sentiment evolves over time based on real feedback.</p>
      </div>

      <GlassCard className="p-6 flex-1 flex flex-col min-h-[400px]">
        {isLoading && <div className="flex-1 flex items-center justify-center"><Skeleton className="w-full h-full" /></div>}
        
        {isError && (
          <EmptyState 
            icon={AlertTriangle} 
            title="Couldn't load trend data" 
            message="There was an error communicating with the API." 
            action={<button onClick={refetch} className="px-4 py-2 bg-violet-600 rounded-md text-white">Try Again</button>} 
            className="my-auto"
          />
        )}

        {!isLoading && !isError && normalizedData.length === 0 && (
          <EmptyState 
            icon={BarChart2} 
            title="No trend data" 
            message="Not enough historical feedback collected yet." 
            className="my-auto"
          />
        )}

        {!isLoading && !isError && normalizedData.length > 0 && (
          <div className="flex-1 w-full h-full min-h-0 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={normalizedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorScoreLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9a9aa5" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#9a9aa5" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12121a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px' }}
                  itemStyle={{ color: '#f1f1f4', fontWeight: 'bold' }}
                  labelStyle={{ color: '#9a9aa5', marginBottom: '4px' }}
                  formatter={(value) => [`${value?.toFixed(2)}`, 'Average Sentiment']}
                />
                <Area 
                  type="monotone" 
                  dataKey="averageSentiment" 
                  stroke="#22d3ee" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorScoreLarge)" 
                  activeDot={{ r: 6, fill: '#12121a', stroke: '#22d3ee', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
