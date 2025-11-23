import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { matchCandidateToJob } from '@/lib/candidateMatcher';
import { format } from 'date-fns';
import { Filter, X, Search, Download, FileText, XCircle, Clock, Calendar, CheckCircle, Trophy, Briefcase } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  cover_letter: string;
  applied_at: string;
  jobs: {
    id: string;
    title: string;
    description: string;
    company_name: string;
    required_skills: string[] | null;
  };
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    candidate_profiles: {
      resume_url: string | null;
      skills: string[] | null;
      experience_years: number | null;
      education: string | null;
      bio: string | null;
    } | null;
  };
}

export default function ManageApplications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner (
            id,
            title,
            description,
            company_name,
            required_skills,
            posted_by
          ),
          profiles!applications_candidate_id_fkey (
            full_name,
            email,
            phone,
            candidate_profiles (
              resume_url,
              skills,
              experience_years,
              education,
              bio
            )
          )
        `)
        .eq('jobs.posted_by', user!.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error loading applications:', error);
        toast({
          title: 'Error loading applications',
          description: error.message,
          variant: 'destructive',
        });
        setAllApplications([]);
        setApplications([]);
      } else {
        console.log('Loaded applications:', data?.length || 0);
        setAllApplications(data || []);
        setApplications(data || []);
      }
    } catch (err: any) {
      console.error('Exception loading applications:', err);
      toast({
        title: 'Error loading applications',
        description: err.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setAllApplications([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const uniqueJobs = Array.from(
    new Set(
      allApplications.map((app) => `${app.jobs.title} - ${app.jobs.company_name}`)
    )
  ).sort();
  const statuses = ['pending', 'reviewing', 'interview', 'accepted', 'rejected'];

  // Apply filters
  useEffect(() => {
    let filtered = [...allApplications];

    // Search filter (name, email, job title)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.profiles.full_name.toLowerCase().includes(searchLower) ||
          app.profiles.email.toLowerCase().includes(searchLower) ||
          app.jobs.title.toLowerCase().includes(searchLower) ||
          app.jobs.company_name?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    // Job filter
    if (selectedJob !== 'all') {
      filtered = filtered.filter(
        (app) => `${app.jobs.title} - ${app.jobs.company_name}` === selectedJob
      );
    }

    setApplications(filtered);
  }, [searchTerm, selectedStatus, selectedJob, allApplications]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedJob('all');
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (selectedJob !== 'all' ? 1 : 0);

  const updateApplicationStatus = async (applicationId: string, newStatus: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId);

    if (error) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status updated',
        description: 'Application status has been changed.',
      });
      loadApplications();
    }
  };

  const handleDownloadResume = async (resumeUrl: string | null, candidateName: string) => {
    if (!resumeUrl) {
      toast({
        title: 'No resume available',
        description: 'This candidate has not uploaded a resume.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // If it's a URL, open in new tab or download
      if (resumeUrl.startsWith('http')) {
        window.open(resumeUrl, '_blank');
      } else {
        // If it's a Supabase storage path, get signed URL
        const { data, error } = await supabase.storage
          .from('resumes')
          .createSignedUrl(resumeUrl, 3600);

        if (error) throw error;
        if (data?.signedUrl) {
          const link = document.createElement('a');
          link.href = data.signedUrl;
          link.download = `${candidateName}_resume.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error downloading resume',
        description: error.message,
        variant: 'destructive',
      });
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Applications</h1>
            <p className="text-muted-foreground mt-2">Review and update candidate applications</p>
          </div>
          {allApplications.length > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{allApplications.length}</div>
              <div className="text-sm text-muted-foreground">
                Total Application{allApplications.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by candidate name, email, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <Label>Application Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <span className="capitalize">{status}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Filter */}
                  <div className="space-y-3">
                    <Label>Job Position</Label>
                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                      <SelectTrigger>
                        <SelectValue placeholder="All jobs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {uniqueJobs.map((job) => (
                          <SelectItem key={job} value={job}>
                            {job}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mb-6">
        {allApplications.length > 0 ? (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">{allApplications.length}</div>
                <div className="text-xs text-muted-foreground">Total Applicants</div>
              </div>
              {applications.length !== allApplications.length && (
                <>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="text-2xl font-bold text-primary">{applications.length}</div>
                    <div className="text-xs text-muted-foreground">Filtered Results</div>
                  </div>
                </>
              )}
            </div>
            {applications.length < allApplications.length && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters ({activeFiltersCount})
              </Button>
            )}
          </div>
        ) : loading ? null : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-2">No applications received yet.</p>
              <p className="text-sm text-muted-foreground">
                Applications will appear here when candidates apply to your jobs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {applications.length > 0 && (
        <div className="space-y-6">
        {applications.map((app) => {
          // Get candidate_profiles (one-to-one relationship)
          const candidateProfile = app.profiles.candidate_profiles;
          // Use dummy PDF for now if no resume URL
          const resumeUrl = candidateProfile?.resume_url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
          const hasResume = true; // Always show resume section with dummy PDF

          // Calculate match score
          const matchResult = candidateProfile ? matchCandidateToJob(
            {
              id: app.profiles.email,
              full_name: app.profiles.full_name,
              skills: candidateProfile.skills || [],
              experience_years: candidateProfile.experience_years || null,
              education: candidateProfile.education || null,
              bio: candidateProfile.bio || null,
              resume_url: candidateProfile.resume_url || null,
            },
            {
              id: app.jobs.id,
              title: app.jobs.title,
              description: app.jobs.description,
              required_skills: app.jobs.required_skills || [],
            }
          ) : null;

          return (
            <Card key={app.id} className="w-full border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <CardTitle className="text-xl">{app.profiles.full_name}</CardTitle>
                      {matchResult && (
                        <Badge variant="default" className="bg-primary">
                          <Trophy className="h-3 w-3 mr-1" />
                          {matchResult.matchScore}% Match
                        </Badge>
                      )}
                      <Badge className={getStatusColor(app.status)} variant="outline">
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <CardDescription className="text-base">
                        <span className="font-semibold text-foreground">{app.jobs.title}</span>
                        {' at '}
                        <span className="font-medium text-foreground">{app.jobs.company_name}</span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Match Score Breakdown */}
                {matchResult && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">Match Analysis</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Overall Match:</span>
                        <span className="font-semibold">{matchResult.matchScore}%</span>
                      </div>
                      <Progress value={matchResult.matchScore} className="h-2 mb-3" />
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Skills:</span>
                          <span className="ml-1 font-medium">{matchResult.skillMatch}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Experience:</span>
                          <span className="ml-1 font-medium">{matchResult.experienceMatch}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Education:</span>
                          <span className="ml-1 font-medium">{matchResult.educationMatch}%</span>
                        </div>
                      </div>
                      {matchResult.breakdown.matchedSkills.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">Matched Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {matchResult.breakdown.matchedSkills.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {matchResult.breakdown.missingSkills.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-primary/20">
                          <p className="text-xs text-muted-foreground mb-1">Missing Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {matchResult.breakdown.missingSkills.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Candidate Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{app.profiles.email}</p>
                  </div>
                  {app.profiles.phone && (
                    <div>
                      <p className="text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">{app.profiles.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Applied on: {format(new Date(app.applied_at), 'PPP')}
                  </p>
                </div>

                {/* Resume Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h4 className="text-base font-semibold">Resume</h4>
                    </div>
                    {hasResume ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadResume(resumeUrl, app.profiles.full_name)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </Button>
                    ) : (
                      <Badge variant="secondary">No resume uploaded</Badge>
                    )}
                  </div>

                  {hasResume && (
                    <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <FileText className="h-4 w-4" />
                        <span>Resume Preview</span>
                        {!candidateProfile?.resume_url && (
                          <Badge variant="outline" className="ml-2 text-xs">Sample Resume</Badge>
                        )}
                      </div>
                      <iframe
                        src={resumeUrl}
                        className="w-full h-96 mt-2 rounded border"
                        title="Resume Preview"
                      />
                    </div>
                  )}
                </div>

                {/* Candidate Profile Info */}
                {candidateProfile && (
                  <div className="border-t pt-4 space-y-3">
                    {candidateProfile.skills && candidateProfile.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {candidateProfile.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {candidateProfile.experience_years && (
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">
                          {candidateProfile.experience_years} years
                        </p>
                      </div>
                    )}
                    {candidateProfile.education && (
                      <div>
                        <p className="text-sm font-medium">Education</p>
                        <p className="text-sm text-muted-foreground">
                          {candidateProfile.education}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {app.cover_letter && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.cover_letter}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateApplicationStatus(app.id, 'pending')}
                      className={app.status === 'pending' ? 'bg-primary/10 border-primary' : ''}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateApplicationStatus(app.id, 'reviewing')}
                      className={app.status === 'reviewing' ? 'bg-blue-500/10 border-blue-500' : ''}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateApplicationStatus(app.id, 'interview')}
                      className={app.status === 'interview' ? 'bg-primary/10 border-primary' : ''}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Interview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                      className={app.status === 'accepted' ? 'bg-green-500/10 border-green-500' : ''}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className={app.status === 'rejected' ? 'bg-destructive/10 border-destructive' : ''}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      )}

      {applications.length === 0 && allApplications.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-2">
              No applications found matching your filters.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search criteria or clear the filters to see all {allApplications.length} application{allApplications.length !== 1 ? 's' : ''}.
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
