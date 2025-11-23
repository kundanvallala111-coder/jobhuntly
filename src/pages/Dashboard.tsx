import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('candidate');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
  });
  const [applicationTimeline, setApplicationTimeline] = useState<
    {
      id: string;
      status: string;
      applied_at: string;
      updated_at: string;
      jobs: { title: string; company_name: string };
    }[]
  >([]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    if (profile) {
      setUserRole(profile.role);
      
      if (profile.role === 'recruiter') {
        loadRecruiterStats();
      } else {
        loadCandidateStats();
      }
    }
  };

  const loadRecruiterStats = async () => {
    // Get total jobs posted
    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('posted_by', user!.id);

    // Get total applications received
    const { count: applicationsCount } = await supabase
      .from('applications')
      .select('*, jobs!inner(posted_by)', { count: 'exact', head: true })
      .eq('jobs.posted_by', user!.id);

    // Get pending applications
    const { count: pendingCount } = await supabase
      .from('applications')
      .select('*, jobs!inner(posted_by)', { count: 'exact', head: true })
      .eq('jobs.posted_by', user!.id)
      .eq('status', 'pending');

    setStats({
      totalJobs: jobsCount || 0,
      totalApplications: applicationsCount || 0,
      pendingApplications: pendingCount || 0,
      acceptedApplications: 0,
    });
  };

  const loadCandidateStats = async () => {
    // Get total jobs available
    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get total applications submitted
    const { count: applicationsCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('candidate_id', user!.id);

    // Get pending applications
    const { count: pendingCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('candidate_id', user!.id)
      .eq('status', 'pending');

    // Get accepted applications
    const { count: acceptedCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('candidate_id', user!.id)
      .eq('status', 'accepted');

    const { data: timelineData } = await supabase
      .from('applications')
      .select(
        `
        id,
        status,
        applied_at,
        updated_at,
        jobs (
          title,
          company_name
        )
      `
      )
      .eq('candidate_id', user!.id)
      .order('applied_at', { ascending: false })
      .limit(5);

    setStats({
      totalJobs: jobsCount || 0,
      totalApplications: applicationsCount || 0,
      pendingApplications: pendingCount || 0,
      acceptedApplications: acceptedCount || 0,
    });
    setApplicationTimeline(timelineData || []);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">
              {userRole === 'recruiter' ? 'Recruiter workspace' : 'Candidate workspace'}
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              {userRole === 'recruiter' ? 'Recruiter Dashboard' : 'Candidate Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {userRole === 'recruiter'
                ? 'Manage your job postings and track applications'
                : 'Track your applications and find your next opportunity'}
            </p>
          </div>
          <div className="flex gap-2 bg-muted/30 rounded-full px-4 py-2">
            {['Dashboard', 'Applications', 'Analytics', 'Profile'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'recruiter' ? 'Active Jobs' : 'Available Jobs'}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'recruiter' ? 'Jobs you posted' : 'Jobs to apply'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'recruiter' ? 'Applications received' : 'Applications submitted'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'recruiter' ? 'In Review' : 'Accepted'}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'recruiter' ? 'Being reviewed' : 'Successful applications'}
            </p>
          </CardContent>
        </Card>
      </div>

      {userRole === 'candidate' && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Application Timeline</span>
                <button
                  className="text-sm text-primary flex items-center gap-1"
                  onClick={() => navigate('/applications')}
                >
                  View all <ArrowRight className="h-4 w-4" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicationTimeline.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No applications yet. Apply to jobs to see your timeline here.
                </p>
              )}
              {applicationTimeline.map((app) => {
                const events = [
                  { label: 'Submitted', date: app.applied_at, active: true },
                  {
                    label: 'Under Review',
                    date: app.status !== 'pending' ? app.updated_at : null,
                    active: ['reviewing', 'interview', 'accepted', 'rejected'].includes(app.status),
                  },
                  {
                    label: 'Interview Scheduled',
                    date: app.status === 'interview' ? app.updated_at : null,
                    active: ['interview', 'accepted'].includes(app.status),
                  },
                  {
                    label: 'Decision',
                    date: ['accepted', 'rejected'].includes(app.status) ? app.updated_at : null,
                    active: ['accepted', 'rejected'].includes(app.status),
                  },
                ];

                return (
                  <div key={app.id} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold">{app.jobs.title}</p>
                        <p className="text-sm text-muted-foreground">{app.jobs.company_name}</p>
                      </div>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {app.status}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-4">
                      {events.map((event) => (
                        <div key={event.label}>
                          <p className={`text-sm font-medium ${event.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {event.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'Pending'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
