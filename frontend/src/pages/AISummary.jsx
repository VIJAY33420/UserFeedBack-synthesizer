import React, { useState } from 'react';
import { useSummary } from '../hooks/useSummary';
import { GlassCard } from '../components/ui/GlassCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AISummary() {
  const [productName, setProductName] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  
  const mutation = useSummary();

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    setSummaryResult(null);
    mutation.mutate({ productName: productName.trim() }, {
      onSuccess: (data) => {
        setSummaryResult(data);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to generate summary');
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          AI Summary
        </h1>
        <p className="text-textMuted">
          Generate an AI-powered summary of user feedback for a specific product. 
          Powered by Google Gemini — this may take a few seconds.
        </p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-textMuted mb-1">Product Name</label>
            <input
              type="text"
              required
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="w-full bg-background/50 border border-borderLight rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              placeholder="e.g. Mobile App v2"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center whitespace-nowrap"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Summary
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {mutation.isPending && (
        <GlassCard className="p-8 text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-violet-400" size={32} />
          <p className="text-textMuted">Calling Gemini AI to analyze your feedback...</p>
          <p className="text-xs text-textMuted mt-1">This typically takes 2-5 seconds.</p>
        </GlassCard>
      )}

      {summaryResult && (
        <GlassCard className="p-8 border-violet-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-violet-400" />
            <h3 className="text-lg font-bold text-white">Summary for "{summaryResult.productName}"</h3>
          </div>
          <div className="text-xs text-textMuted mb-4">
            Based on {summaryResult.feedbackCount} feedback entries
          </div>
          <div className="bg-background/40 rounded-xl p-6 border border-borderLight">
            <p className="text-textMain leading-relaxed text-base whitespace-pre-wrap">
              {summaryResult.summary}
            </p>
          </div>
        </GlassCard>
      )}

      {mutation.isError && !summaryResult && (
        <EmptyState 
          icon={AlertTriangle} 
          title="Summary generation failed" 
          message={mutation.error?.response?.data?.message || "Check that the product name has associated feedback."} 
        />
      )}

      {!mutation.isPending && !summaryResult && !mutation.isError && (
        <EmptyState 
          icon={Sparkles} 
          title="Ready to summarize" 
          message="Enter a product name and hit Generate. We'll use AI to synthesize all feedback for that product into a concise summary." 
        />
      )}
    </div>
  );
}
