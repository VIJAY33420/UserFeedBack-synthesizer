import React from 'react';
import { useUser } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { GlassCard } from '../components/ui/GlassCard';
import { Skeleton } from '../components/ui/SkeletonLoader';
import { User, Mail, Shield, LogOut, Calendar } from 'lucide-react';

export default function Profile() {
  const { data: userData, isLoading, isError } = useUser();
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-textMuted">Your account details and session.</p>
      </div>

      <GlassCard className="p-6">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {isError && (
          <div className="text-rose-400 text-sm">Could not load profile data. The backend may be unreachable.</div>
        )}

        {!isLoading && !isError && userData && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-500/20">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                <span className="text-xs text-textMuted capitalize">{userData.role || 'user'}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-borderLight">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-textMuted" />
                <span className="text-textMain">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-textMuted" />
                <span className="text-textMain capitalize">{userData.role || 'user'}</span>
              </div>
              {userData.createdAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-textMuted" />
                  <span className="text-textMain">Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassCard>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium rounded-xl px-4 py-3 transition-colors border border-rose-500/20"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
