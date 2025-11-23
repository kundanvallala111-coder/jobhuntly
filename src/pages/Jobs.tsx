import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Briefcase, Search, Filter, X } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_range: string;
  required_skills: string[];
  company_name: string;
  created_at: string;
}

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [minSalary, setMinSalary] = useState<string>('');
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
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

  const applyToJob = async (jobId: string) => {
    try {
      const { error } = await supabase.from('applications').insert({
        job_id: jobId,
        candidate_id: user!.id,
        status: 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already applied',
            description: 'You have already applied to this job.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Application submitted!',
          description: 'Your application has been sent successfully.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Application failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Get unique values for filters
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location))).sort();
  const uniqueSkills = Array.from(
    new Set(jobs.flatMap(job => job.required_skills || []))
  ).sort();
  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];

  // Extract numeric salary from string (e.g., "$80,000 - $120,000" -> 80000)
  const extractMinSalary = (salaryRange: string | null): number => {
    if (!salaryRange) return 0;
    const match = salaryRange.match(/\$?([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  const extractMaxSalary = (salaryRange: string | null): number => {
    if (!salaryRange) return Infinity;
    const matches = salaryRange.match(/\$?([\d,]+)/g);
    if (matches && matches.length > 1) {
      return parseInt(matches[1].replace(/\$|,/g, ''));
    }
    return extractMinSalary(salaryRange);
  };

  const filteredJobs = jobs.filter((job) => {
    // Search filter
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Job type filter
    const matchesJobType =
      selectedJobTypes.length === 0 || selectedJobTypes.includes(job.job_type);

    // Location filter
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;

    // Salary filter
    const jobMinSalary = extractMinSalary(job.salary_range);
    const jobMaxSalary = extractMaxSalary(job.salary_range);
    const minSalaryNum = minSalary ? parseInt(minSalary) : 0;
    const maxSalaryNum = maxSalary ? parseInt(maxSalary) : Infinity;
    const matchesSalary =
      (!minSalary || jobMaxSalary >= minSalaryNum) &&
      (!maxSalary || jobMinSalary <= maxSalaryNum);

    // Skills filter
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some(skill =>
        job.required_skills?.some(rs =>
          rs.toLowerCase().includes(skill.toLowerCase())
        )
      );

    return (
      matchesSearch &&
      matchesJobType &&
      matchesLocation &&
      matchesSalary &&
      matchesSkills
    );
  });

  const handleJobTypeToggle = (jobType: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType)
        ? prev.filter((t) => t !== jobType)
        : [...prev, jobType]
    );
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedJobTypes([]);
    setSelectedLocation('all');
    setMinSalary('');
    setMaxSalary('');
    setSelectedSkills([]);
  };

  const activeFiltersCount =
    selectedJobTypes.length +
    (selectedLocation !== 'all' ? 1 : 0) +
    (minSalary || maxSalary ? 1 : 0) +
    selectedSkills.length;

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
        <h1 className="text-3xl font-bold text-foreground">Browse Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Find your next career opportunity
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs by title, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Section */}
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Job Type Filter */}
                  <div className="space-y-3">
                    <Label>Job Type</Label>
                    <div className="space-y-2">
                      {jobTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`job-type-${type}`}
                            checked={selectedJobTypes.includes(type)}
                            onCheckedChange={() => handleJobTypeToggle(type)}
                          />
                          <label
                            htmlFor={`job-type-${type}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <Label>Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary Range Filter */}
                  <div className="space-y-3">
                    <Label>Salary Range</Label>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="min-salary" className="text-xs text-muted-foreground">
                          Min ($)
                        </Label>
                        <Input
                          id="min-salary"
                          type="number"
                          placeholder="e.g., 50000"
                          value={minSalary}
                          onChange={(e) => setMinSalary(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="max-salary" className="text-xs text-muted-foreground">
                          Max ($)
                        </Label>
                        <Input
                          id="max-salary"
                          type="number"
                          placeholder="e.g., 150000"
                          value={maxSalary}
                          onChange={(e) => setMaxSalary(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div className="space-y-3">
                    <Label>Required Skills</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2">
                      {uniqueSkills.slice(0, 20).map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <label
                            htmlFor={`skill-${skill}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                      {uniqueSkills.length > 20 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          Showing first 20 skills
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">{job.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.job_type}</span>
                </div>
                {job.salary_range && (
                  <p className="text-sm text-muted-foreground">
                    Salary: {job.salary_range}
                  </p>
                )}
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.required_skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => applyToJob(job.id)} className="w-full">
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {jobs.length === 0
                ? 'No jobs available at the moment.'
                : 'No jobs found matching your filters. Try adjusting your search criteria.'}
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {filteredJobs.length > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>
      )}
    </div>
  );
}
