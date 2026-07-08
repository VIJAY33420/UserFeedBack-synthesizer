import React, { useState } from 'react';
import { useLogin, useSignup } from '../hooks/useAuth';
import { GlassCard } from '../components/ui/GlassCard';
import { Activity, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ email, password }, {
        onError: (err) => toast.error(err.response?.data?.message || 'Login failed')
      });
    } else {
      signupMutation.mutate({ name, email, password }, {
        onError: (err) => toast.error(err.response?.data?.message || 'Signup failed')
      });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center z-10">
        <div className="hidden md:block space-y-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-8">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            From thousands of scattered comments to one clear shortlist.
          </h1>
          <p className="text-lg text-textMuted">
            Understand what to build next. We turn user feedback into actionable insights.
          </p>
        </div>

        <GlassCard className="p-8 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-background/50 border border-borderLight rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-background/50 border border-borderLight rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-borderLight rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg px-4 py-2.5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center h-[44px]"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-textMuted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
