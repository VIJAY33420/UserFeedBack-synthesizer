import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Activity, MessageSquare, BarChart2, Hash, Zap, Sparkles, User, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const TopNav = () => {
  const { logout, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Shortlist', path: '/shortlist', icon: Zap },
    { name: 'Clusters', path: '/clusters', icon: Hash },
    { name: 'Trend', path: '/trend', icon: BarChart2 },
    { name: 'Submit', path: '/submit', icon: MessageSquare },
    { name: 'AI Summary', path: '/summary', icon: Sparkles },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-borderLight bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Synthesizer
              </span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-panel text-violet-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                      : "text-textMuted hover:text-textMain hover:bg-panelHover"
                  )}
                >
                  <item.icon size={16} />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                isActive ? "text-violet-400" : "text-textMuted hover:text-textMain"
              )}
            >
              <User size={16} />
              {user?.name || user?.email || 'Profile'}
            </NavLink>
            <button
              onClick={logout}
              className="hidden sm:flex p-2 text-textMuted hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
            
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-textMuted hover:text-white transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-borderLight bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-panel text-violet-400" 
                    : "text-textMuted hover:text-textMain hover:bg-panelHover"
                )}
              >
                <item.icon size={16} />
                {item.name}
              </NavLink>
            ))}
            <NavLink
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-panel text-violet-400" : "text-textMuted hover:text-textMain hover:bg-panelHover"
              )}
            >
              <User size={16} />
              Profile
            </NavLink>
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
