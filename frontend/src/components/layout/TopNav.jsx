import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, MessageSquare, BarChart2, Hash, Zap, Sparkles, User, Menu, X, LayoutDashboard, Crown } from 'lucide-react';
import { cn } from '../../utils/cn';

export const TopNav = () => {
  const { logout, user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Shortlist', path: '/shortlist', icon: Zap },
    { name: 'Clusters', path: '/clusters', icon: Hash },
    { name: 'Trend', path: '/trend', icon: BarChart2 },
    { name: 'Submit', path: '/submit', icon: MessageSquare },
    { name: 'AI Summary', path: '/summary', icon: Sparkles },
    { name: 'Plans', path: '/plans', icon: Crown },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-3 py-4">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex min-h-16 items-center justify-between overflow-hidden rounded-full border border-white/5 bg-white/[0.075] px-4 shadow-glass backdrop-blur-2xl sm:px-5">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="flex items-center gap-5">
            <div className="flex flex-shrink-0 items-center gap-2">
              <span 
                className="text-xl pr-1 pt-1 font-bold"
                style={{ color: '#885AF0', }}
              >
                TRAIGE
              </span>
            </div>

              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  className={({ isActive }) => cn(
                    "hidden md:flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300",
                    isActive
                      ? "text-[#885AF0]"
                      : "text-textMuted hover:text-[#885AF0]"
                  )}
                >
                  <item.icon size={16} className="shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </NavLink>
              ))}
          </div>

          <div className="flex flex-shrink-0 items-center gap-3 pl-6 lg:pl-10">
            <NavLink
              to="/profile"
              className={({ isActive }) => cn(
                "hidden max-w-[190px] items-center gap-2 truncate rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-sm font-medium transition-all sm:flex",
                isActive ? "text-cyan-200 shadow-[0_0_30px_rgba(98,230,255,0.13)]" : "text-textMuted hover:text-white"
              )}
            >
              <User size={16} />
              <span className="truncate">{user?.name || user?.email || 'Profile'}</span>
            </NavLink>
            <button
              onClick={logout}
              className="hidden rounded-full border border-white/10 bg-white/[0.055] p-2.5 text-textMuted transition-all hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300 sm:flex"
              title="Logout"
            >
              <LogOut size={18} />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full border border-white/10 bg-white/[0.055] p-2 text-textMuted transition-colors hover:text-white md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-white/15 bg-background/80 p-3 shadow-glass backdrop-blur-2xl md:hidden">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "text-[#885AF0]"
                    : "text-textMuted hover:text-[#885AF0]"
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
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors",
                isActive ? "text-[#885AF0]" : "text-textMuted hover:text-[#885AF0]"
              )}
            >
              <User size={16} />
              Profile
            </NavLink>
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/10"
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
