import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { BarChart3, TrendingUp, Users, Briefcase } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedRate: 0,
    offersAccepted: 0,
    averageResponseTime: 0,
    topSkills: [] as { skill: string; count: number }[],
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    // Get total jobs
    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('posted_by', user!.id);

    // Get all applications
    const { data: applications, count: applicationsCount } = await supabase
      .from('applications')
      .select('*, jobs!inner(posted_by)', { count: 'exact' })
      .eq('jobs.posted_by', user!.id);

    // Get pending applications
    const { count: pendingCount } = await supabase
      .from('applications')
      .select('*, jobs!inner(posted_by)', { count: 'exact', head: true })
      .eq('jobs.posted_by', user!.id)
      .eq('status', 'pending');

    // Calculate acceptance rate
    const acceptedApps = applications?.filter(app => app.status === 'accepted') || [];
    const acceptedCount = acceptedApps.length;
    const acceptedRate = applicationsCount ? (acceptedCount / applicationsCount) * 100 : 0;

    // Average response time (in days) between applied_at and updated_at
    const responseTimes =
      applications
        ?.map(app => {
          const appliedDate = app.applied_at ? new Date(app.applied_at) : null;
          const updatedDate = app.updated_at ? new Date(app.updated_at) : null;
          if (appliedDate && updatedDate) {
            const diffMs = updatedDate.getTime() - appliedDate.getTime();
            return diffMs > 0 ? diffMs / (1000 * 60 * 60 * 24) : null;
          }
          return null;
        })
        .filter((value): value is number => value !== null) || [];
    const averageResponseTime =
      responseTimes.length > 0
        ? Math.round((responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) * 10) / 10
        : 0;

    setStats({
      totalJobs: jobsCount || 0,
      totalApplications: applicationsCount || 0,
      pendingApplications: pendingCount || 0,
      acceptedRate: Math.round(acceptedRate),
      offersAccepted: acceptedCount,
      averageResponseTime,
      topSkills: [],
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track your recruitment performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">Active job listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Candidates applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptedRate}%</div>
            <p className="text-xs text-muted-foreground">Of all applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers Accepted</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.offersAccepted}</div>
            <p className="text-xs text-muted-foreground">Total accepted offers</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Overview of application stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization coming soon
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
            <CardDescription>Time between application and latest update</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-foreground">{stats.averageResponseTime}d</p>
                <p className="text-sm">Average response time</p>
              </div>
              <p className="text-xs text-center px-6">
                This metric reflects how quickly applications move from submission to the next update. Faster response
                times indicate a healthier review pipeline.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
