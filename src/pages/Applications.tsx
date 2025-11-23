import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';

interface Application {
  id: string;
  status: string;
  cover_letter: string;
  applied_at: string;
  updated_at: string;
  jobs: {
    title: string;
    company_name: string;
    location: string;
  };
}

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          title,
          company_name,
          location
        )
      `)
      .eq('candidate_id', user!.id)
      .order('applied_at', { ascending: false });

    if (!error && data) {
      setApplications(data);
      setUpcomingInterviews(data.filter((app) => app.status === 'interview'));
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'reviewing':
        return 'bg-info text-info-foreground';
      case 'interview':
        return 'bg-primary text-primary-foreground';
      case 'accepted':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
        <p className="text-muted-foreground mt-2">Track the status of all your job applications</p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No interviews scheduled yet. Once your applications reach the interview stage, they’ll appear here.
              </p>
            )}
            {upcomingInterviews.map((app) => (
              <div key={app.id} className="border rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{app.jobs.title}</p>
                  <p className="text-sm text-muted-foreground">{app.jobs.company_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(app.updated_at || app.applied_at), 'PPP • p')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button size="sm">Add to Calendar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{app.jobs.title}</CardTitle>
                  <CardDescription>
                    {app.jobs.company_name} · {app.jobs.location}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(app.status)}>
                  {app.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Applied on: {format(new Date(app.applied_at), 'PPP')}
                  </p>
                  {app.cover_letter && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Cover Letter</h4>
                      <p className="text-sm text-muted-foreground">{app.cover_letter}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Timeline</p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    {[
                      { label: 'Submitted', date: app.applied_at },
                      {
                        label: 'Under Review',
                        date: ['reviewing', 'interview', 'accepted', 'rejected'].includes(app.status)
                          ? app.updated_at
                          : null,
                      },
                      {
                        label: 'Interview',
                        date: app.status === 'interview' ? app.updated_at : null,
                      },
                      {
                        label: 'Decision',
                        date: ['accepted', 'rejected'].includes(app.status) ? app.updated_at : null,
                      },
                    ].map((event) => (
                      <div key={event.label} className="border rounded-lg p-2">
                        <p className="font-medium">{event.label}</p>
                        <p>{event.date ? format(new Date(event.date), 'MMM d, yyyy') : 'Pending'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
