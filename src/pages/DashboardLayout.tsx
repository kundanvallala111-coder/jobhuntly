import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, LogOut, Plus, Search, Home, User } from 'lucide-react';
import { NotificationBar } from '@/components/NotificationBar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [userRole, setUserRole] = useState<string>('candidate');

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setUserRole(data.role);
        });
    }
  }, [user]);

  const candidateNavLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Browse Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Resume Matcher', path: '/resume-matcher', icon: Search },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const recruiterNavLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Post Job', path: '/post-job', icon: Plus },
    { label: 'My Jobs', path: '/my-jobs', icon: Briefcase },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const navLinks = userRole === 'recruiter' ? recruiterNavLinks : candidateNavLinks;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">JobHuntly Workspace</p>
              <p className="text-lg font-semibold">
                {userRole === 'recruiter' ? 'Recruiter Center' : 'Command Center'}
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.path);
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition flex items-center gap-2 ${
                    active ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-white/70 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                </button>
              );
            })}
            <NotificationBar />
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-80px)] bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
}
