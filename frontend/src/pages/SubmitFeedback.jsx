import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useSubmitFeedback } from '../hooks/useFeedback';
import { Loader2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { SentimentBadge } from '../components/ui/SentimentBadge';
import { ActionTag } from '../components/ui/ActionTag';
import { ClusterTag } from '../components/ui/ClusterTag';
import toast from 'react-hot-toast';

export default function SubmitFeedback() {
  const [text, setText] = useState('');
  const [source, setSource] = useState('In-App Form');
  const [productName, setProductName] = useState('');
  const [result, setResult] = useState(null);

  const mutation = useSubmitFeedback();

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);
    mutation.mutate({ text, source, productName }, {
      onSuccess: (data) => {
        setResult(data);
        setText('');
        toast.success('Feedback analyzed successfully!');
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to submit feedback');
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Submit Feedback</h1>
        <p className="text-textMuted">Simulate incoming feedback. Our AI pipeline will analyze sentiment, classify the cluster, and assign a priority score instantly.</p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
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

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Source</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full bg-background/50 border border-borderLight rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none"
            >
              <option value="In-App Form">In-App Form</option>
              <option value="App Store Review">App Store Review</option>
              <option value="Support Ticket">Support Ticket</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Feedback Text</label>
            <textarea
              required
              rows={4}
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full bg-background/50 border border-borderLight rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none"
              placeholder="What are users saying?"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg px-6 py-2.5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <MessageSquare size={18} />
                  Submit
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {result && (
        <GlassCard className="p-6 border-emerald-500/30" variant="nested">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="text-emerald-500 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-emerald-400">Analysis Complete</h3>
              <p className="text-sm text-textMuted">Feedback successfully synthesized and prioritized.</p>
            </div>
          </div>
          
          <div className="bg-background/40 rounded-lg p-4 border border-borderLight flex flex-wrap gap-4">
            <div>
              <div className="text-[10px] text-textMuted uppercase mb-1">Priority</div>
              <div className="text-xl font-bold text-white">{Math.round((result.priorityScore || 0) * 100)}%</div>
            </div>
            <div className="w-px bg-borderLight"></div>
            <div>
              <div className="text-[10px] text-textMuted uppercase mb-1">Action</div>
              <ActionTag action={result.actionTag} />
            </div>
            <div className="w-px bg-borderLight"></div>
            <div>
              <div className="text-[10px] text-textMuted uppercase mb-1">Sentiment</div>
              <SentimentBadge sentiment={result.sentimentLabel} score={result.sentimentScore} />
            </div>
            <div className="w-px bg-borderLight"></div>
            <div>
              <div className="text-[10px] text-textMuted uppercase mb-1">Cluster</div>
              <ClusterTag cluster={result.cluster} />
            </div>
          </div>
        </GlassCard>
      )}
      
      {mutation.isError && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          Failed to submit feedback. Please try again later.
        </div>
      )}
    </div>
  );
}
