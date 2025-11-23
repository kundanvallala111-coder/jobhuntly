import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Users } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  company_name: string;
  status: string;
  created_at: string;
  applications: { count: number }[];
}

export default function MyJobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications (count)
      `)
      .eq('posted_by', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error loading jobs',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);

    if (error) {
      toast({
        title: 'Error deleting job',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Job deleted',
        description: 'The job listing has been removed.',
      });
      loadJobs();
    }
  };

  const getApplicationCount = (job: Job) => {
    return job.applications?.[0]?.count || 0;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Job Listings</h1>
        <p className="text-muted-foreground mt-2">Manage your posted jobs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map((job) => {
          const applicationCount = getApplicationCount(job);

          return (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company_name}</CardDescription>
                  </div>
                  <Badge 
                    variant={
                      job.status === 'active' 
                        ? 'default' 
                        : job.status === 'draft' 
                        ? 'outline' 
                        : 'secondary'
                    }
                    title={
                      job.status === 'active' 
                        ? 'Job is live and accepting applications' 
                        : job.status === 'draft' 
                        ? 'Job is saved as draft and not visible to candidates' 
                        : 'Job is closed and no longer accepting applications'
                    }
                  >
                    {job.status === 'active' ? '✓ Active' : job.status === 'draft' ? '📝 Draft' : '✗ Closed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground line-clamp-2 mb-4">{job.description}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Location: {job.location}</p>
                  <p>Type: {job.job_type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4" />
                    <p className="font-medium text-foreground">
                      {applicationCount} {applicationCount === 1 ? 'Application' : 'Applications'}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteJob(job.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
