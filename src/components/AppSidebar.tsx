import { useEffect, useState } from 'react';
import { Briefcase, LogOut, Plus, Search, Home, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
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

  const candidateItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Browse Jobs', url: '/jobs', icon: Briefcase },
    { title: 'Resume Matcher', url: '/resume-matcher', icon: Search },
    { title: 'Profile', url: '/profile', icon: User },
  ];

  const recruiterItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Post Job', url: '/post-job', icon: Plus },
    { title: 'My Jobs', url: '/my-jobs', icon: Briefcase },
    { title: 'Profile', url: '/profile', icon: User },
  ];

  const items = userRole === 'recruiter' ? recruiterItems : candidateItems;
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={state === 'collapsed' ? 'w-14' : 'w-60'}>
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg ${state === 'collapsed' ? 'hidden' : 'block'}`}>
            JobHuntly
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={state === 'collapsed' ? 'hidden' : 'block'}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== 'collapsed' && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} className="hover:bg-sidebar-accent/50">
              <LogOut className="h-4 w-4" />
              {state !== 'collapsed' && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
