import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PostJob() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);
  const [interviewTime, setInterviewTime] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Get user's company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user!.id)
        .single();
  
      if (!profile?.company_id) {
        toast({
          title: 'No company found',
          description: 'Please set up your company first.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.from('jobs').insert({
        title,
        description,
        location,
        job_type: jobType,
        salary_range: salaryRange,
        company_id: profile.company_id, // Use company_id instead of company_name
        required_skills: skills,
        posted_by: user!.id,
        status: 'active',
      });
  
      if (error) throw error;
  
      toast({
        title: 'Job posted successfully!',
        description: 'Your job listing is now live.',
      });
  
      navigate('/my-jobs');
    } catch (error: any) {
      toast({
        title: 'Failed to post job',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Post a New Job</h1>
        <p className="text-muted-foreground mt-2">Create a job listing to attract top talent</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Fill in the information about the position</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="TechCorp Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="$80,000 - $120,000"
              />
            </div>

            <div className="space-y-2">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a required skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label className="text-base font-semibold flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" />
                  Suggested Interview Schedule
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Set a suggested interview date and time for candidates
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interview Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !interviewDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {interviewDate ? format(interviewDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={interviewDate}
                        onSelect={setInterviewDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Interview Time</Label>
                  <Input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="09:00"
                  />
                </div>
              </div>

              {interviewDate && interviewTime && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium">
                    Suggested Interview: {format(interviewDate, "PPP")} at {interviewTime}
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
