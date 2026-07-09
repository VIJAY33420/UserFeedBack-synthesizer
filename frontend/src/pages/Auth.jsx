import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Brain, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useLogin, useSignup, useGoogleLoginMutation } from '../hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../store/authStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const googleLoginMutation = useGoogleLoginMutation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleLoginMutation.mutate({ token: tokenResponse.access_token }, {
        onError: (err) => toast.error(err.response?.data?.message || 'Google login failed'),
      });
    },
    onError: () => toast.error('Google login failed'),
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ email, password }, {
        onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
      });
    } else {
      signupMutation.mutate({ name, email, password }, {
        onError: (err) => toast.error(err.response?.data?.message || 'Signup failed'),
      });
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending || googleLoginMutation.isPending;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:76px_76px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
        <div className="absolute left-[-10%] top-[-12%] h-[34rem] w-[34rem] rounded-full bg-brandBlue/24 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-12%] h-[36rem] w-[36rem] rounded-full bg-brandPurple/24 blur-[140px]" />
      </div>

      <Link to="/" className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.06] px-4 py-2 text-sm font-semibold text-textMuted backdrop-blur-xl transition-colors hover:text-white">
        <ArrowLeft size={16} />
        Landing
      </Link>

      <div className="z-10 grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden space-y-7 md:block">

          <h1 className="font-display text-5xl font-bold leading-tight tracking-normal text-white">
            Welcome to your feedback command center.
          </h1>
          <p className="text-lg leading-8 text-textMuted">
            Sign in and turn raw comments into sentiment, clusters, summaries, and a product-ready shortlist.
          </p>

          <div className="grid gap-3">
            {[
              ['AI summaries', Sparkles],
              ['Priority scoring', Brain],
              ['Clean dashboard experience', CheckCircle2],
            ].map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
                <Icon size={18} className="text-cyan-300" />
                <span className="font-semibold text-white">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="mx-auto w-full max-w-md border-white/[0.1] p-7 sm:p-8">
          <div className="mb-7 md:hidden">
            <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-frost shadow-glow">
              <img src="/traige-logo.png" alt="Traige logo" className="h-16 w-16 object-cover object-center" />
            </div>
            <div className="font-display text-2xl font-bold tracking-[0.16em] text-white">TRAIGE</div>
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-cyan-200">
            {isLogin ? 'Secure Access' : 'Create Workspace'}
          </p>
          <h2 className="mb-7 text-3xl font-bold text-white">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-textMuted">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="field-glass"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-textMuted">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field-glass"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-textMuted">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-glass"
                placeholder="Password"
              />
            </div>

            <button type="submit" disabled={isLoading} className="primary-button h-12 w-full">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              type="button"
              className="secondary-button h-12 w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.54998L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.60998L5.27028 9.70498C6.21528 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21538 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-textMuted">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-cyan-200 transition-colors hover:text-white"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
