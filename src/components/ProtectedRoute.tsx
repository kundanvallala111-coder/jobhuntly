import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checkingCompany, setCheckingCompany] = useState(true);
  const [needsCompanySetup, setNeedsCompanySetup] = useState(false);

  useEffect(() => {
    const checkCompanySetup = async () => {
      if (!user || loading) {
        setCheckingCompany(false);
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, company_id')
        .eq('id', user.id)
        .single();

      // If recruiter and no company_id, needs setup
      // Only redirect if not already on company setup pages or dashboard
      if (profile?.role === 'recruiter' && !profile?.company_id) {
        // Don't redirect if already on company setup pages or dashboard
        if (
          !location.pathname.startsWith('/company-setup') &&
          location.pathname !== '/dashboard' &&
          !location.pathname.startsWith('/post-job') &&
          !location.pathname.startsWith('/my-jobs') &&
          !location.pathname.startsWith('/manage-applications') &&
          !location.pathname.startsWith('/analytics')
        ) {
          setNeedsCompanySetup(true);
        }
      }
      setCheckingCompany(false);
    };

    checkCompanySetup();
  }, [user, loading, location.pathname]);

  if (loading || checkingCompany) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (needsCompanySetup) {
    return <Navigate to="/company-setup" replace />;
  }

  return <>{children}</>;
}