import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Plus, Trash2, Briefcase, GraduationCap, Link as LinkIcon, Bell, FileText, Calendar, AlertCircle, MessageSquare, CheckCircle, XCircle, ExternalLink, Download } from 'lucide-react';

interface Experience {
  id?: string;
  job_title: string;
  company_name: string;
  start_date: string;
  end_date: string;
  description: string;
  is_current?: boolean;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  major: string;
  start_year: string;
  graduation_year: string;
}

interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  url: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Professional Snapshot
  const [currentRole, setCurrentRole] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [preferredJobTitles, setPreferredJobTitles] = useState<string[]>([]);
  const [newPreferredTitle, setNewPreferredTitle] = useState('');
  const [preferredEmploymentType, setPreferredEmploymentType] = useState('');

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Education
  const [education, setEducation] = useState<Education[]>([]);

  // Career Preferences
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [openToRelocation, setOpenToRelocation] = useState(false);
  const [remotePreference, setRemotePreference] = useState('');

  // Portfolio & Links
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);

  // Other
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const completionFactors = [
    fullName,
    phone,
    location,
    bio,
    skills.length > 0,
    preferredJobTitles.length > 0,
    experiences.length > 0,
    education.length > 0,
    linkedinUrl || githubUrl || websiteUrl,
  ];
  const completionPercent = Math.round(
    (completionFactors.filter(Boolean).length / completionFactors.length) * 100
  );


  useEffect(() => {
    loadProfile();
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user) return;
    setNotificationsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer_extended':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'interview_scheduled':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'action_required':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'application_status_change':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'recruiter_message':
        return <MessageSquare className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationPriority = (type: string): number => {
    // Priority order: 1 = highest, 5 = lowest
    switch (type) {
      case 'offer_extended': return 1;
      case 'interview_scheduled': return 2;
      case 'action_required': return 3;
      case 'application_status_change': return 4;
      case 'recruiter_message': return 5;
      default: return 6;
    }
  };

  const handleViewOfferLetter = (notification: any) => {
    // Open offer letter (could be a PDF or link)
    if (notification.related_id) {
      // In a real app, this would fetch the offer letter
      window.open(`/offer/${notification.related_id}`, '_blank');
    }
    markAsRead(notification.id);
  };

  const handleAddToCalendar = (notification: any) => {
    // Generate calendar event
    if (notification.related_id) {
      // Extract interview details from notification message or related application
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + 1); // Example: tomorrow
      
      const startTime = interviewDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endTime = new Date(interviewDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Interview&dates=${startTime}/${endTime}&details=${encodeURIComponent(notification.message)}`;
      window.open(calendarUrl, '_blank');
    }
    markAsRead(notification.id);
  };

  const loadProfile = async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single();

    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
    }

    const { data: candidateProfile } = await supabase
      .from('candidate_profiles')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    if (candidateProfile) {
      setBio(candidateProfile.bio || '');
      setSkills(candidateProfile.skills || []);
      setCurrentRole(candidateProfile.current_role || '');
      setCurrentCompany(candidateProfile.current_company || '');
      setIndustry(candidateProfile.industry || '');
      setPreferredJobTitles(candidateProfile.preferred_job_titles || []);
      setPreferredEmploymentType(candidateProfile.preferred_employment_type || '');
      setExpectedSalary(candidateProfile.expected_salary_range || '');
      setNoticePeriod(candidateProfile.notice_period || '');
      setOpenToRelocation(candidateProfile.open_to_relocation || false);
      setRemotePreference(candidateProfile.remote_preference || '');
      setLinkedinUrl(candidateProfile.linkedin_url || '');
      setGithubUrl(candidateProfile.github_url || '');
      setWebsiteUrl(candidateProfile.website_url || '');
    }

    // Load experiences
    const { data: experiencesData } = await supabase
      .from('candidate_experiences')
      .select('*')
      .eq('candidate_id', user!.id)
      .order('start_date', { ascending: false });

    if (experiencesData) {
      setExperiences(experiencesData.map(exp => ({
        id: exp.id,
        job_title: exp.job_title,
        company_name: exp.company_name,
        start_date: exp.start_date,
        end_date: exp.end_date || '',
        description: exp.description || '',
        is_current: !exp.end_date
      })));
    }

    // Load education
    const { data: educationData } = await supabase
      .from('candidate_education')
      .select('*')
      .eq('candidate_id', user!.id)
      .order('graduation_year', { ascending: false });

    if (educationData) {
      setEducation(educationData.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        major: edu.major || '',
        start_year: edu.start_year?.toString() || '',
        graduation_year: edu.graduation_year?.toString() || ''
      })));
    }

    // Load portfolio projects
    const { data: projectsData } = await supabase
      .from('candidate_portfolio_projects')
      .select('*')
      .eq('candidate_id', user!.id);

    if (projectsData) {
      setPortfolioProjects(projectsData.map(proj => ({
        id: proj.id,
        title: proj.title,
        description: proj.description || '',
        url: proj.url || ''
      })));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddPreferredTitle = () => {
    if (newPreferredTitle.trim() && !preferredJobTitles.includes(newPreferredTitle.trim())) {
      setPreferredJobTitles([...preferredJobTitles, newPreferredTitle.trim()]);
      setNewPreferredTitle('');
    }
  };

  const handleRemovePreferredTitle = (title: string) => {
    setPreferredJobTitles(preferredJobTitles.filter((t) => t !== title));
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      job_title: '',
      company_name: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
    }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'is_current' && value) {
      updated[index].end_date = '';
    }
    setExperiences(updated);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducation([...education, {
      institution: '',
      degree: '',
      major: '',
      start_year: '',
      graduation_year: ''
    }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addPortfolioProject = () => {
    setPortfolioProjects([...portfolioProjects, {
      title: '',
      description: '',
      url: ''
    }]);
  };

  const updatePortfolioProject = (index: number, field: keyof PortfolioProject, value: string) => {
    const updated = [...portfolioProjects];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioProjects(updated);
  };

  const removePortfolioProject = (index: number) => {
    setPortfolioProjects(portfolioProjects.filter((_, i) => i !== index));
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          location: location,
        })
        .eq('id', user!.id);

      if (profileError) throw profileError;

      // Update candidate_profiles table
      const { error: candidateError } = await supabase
        .from('candidate_profiles')
        .update({
          bio: bio,
          skills: skills,
          current_role: currentRole || null,
          current_company: currentCompany || null,
          industry: industry || null,
          preferred_job_titles: preferredJobTitles,
          preferred_employment_type: preferredEmploymentType || null,
          expected_salary_range: expectedSalary || null,
          notice_period: noticePeriod || null,
          open_to_relocation: openToRelocation,
          remote_preference: remotePreference || null,
          linkedin_url: linkedinUrl || null,
          github_url: githubUrl || null,
          website_url: websiteUrl || null,
        })
        .eq('user_id', user!.id);

      if (candidateError) throw candidateError;

      // Save experiences
      for (const exp of experiences) {
        if (exp.id) {
          // Update existing
          await supabase
            .from('candidate_experiences')
            .update({
              job_title: exp.job_title,
              company_name: exp.company_name,
              start_date: exp.start_date,
              end_date: exp.is_current ? null : exp.end_date || null,
              description: exp.description || null,
            })
            .eq('id', exp.id);
        } else {
          // Insert new
          await supabase
            .from('candidate_experiences')
            .insert({
              candidate_id: user!.id,
              job_title: exp.job_title,
              company_name: exp.company_name,
              start_date: exp.start_date,
              end_date: exp.is_current ? null : exp.end_date || null,
              description: exp.description || null,
            });
        }
      }

      // Save education
      for (const edu of education) {
        if (edu.id) {
          await supabase
            .from('candidate_education')
            .update({
              institution: edu.institution,
              degree: edu.degree,
              major: edu.major || null,
              start_year: edu.start_year ? parseInt(edu.start_year) : null,
              graduation_year: edu.graduation_year ? parseInt(edu.graduation_year) : null,
            })
            .eq('id', edu.id);
        } else {
          await supabase
            .from('candidate_education')
            .insert({
              candidate_id: user!.id,
              institution: edu.institution,
              degree: edu.degree,
              major: edu.major || null,
              start_year: edu.start_year ? parseInt(edu.start_year) : null,
              graduation_year: edu.graduation_year ? parseInt(edu.graduation_year) : null,
            });
        }
      }

      // Save portfolio projects
      for (const proj of portfolioProjects) {
        if (proj.id) {
          await supabase
            .from('candidate_portfolio_projects')
            .update({
              title: proj.title,
              description: proj.description || null,
              url: proj.url || null,
            })
            .eq('id', proj.id);
        } else {
          await supabase
            .from('candidate_portfolio_projects')
            .insert({
              candidate_id: user!.id,
              title: proj.title,
              description: proj.description || null,
              url: proj.url || null,
            });
        }
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Sort notifications by priority (highest first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    const priorityA = getNotificationPriority(a.type);
    const priorityB = getNotificationPriority(b.type);
    if (priorityA !== priorityB) return priorityA - priorityB;
    // If same priority, unread first, then by date
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Group notifications by type for display
  const priorityNotifications = sortedNotifications.filter(n => 
    ['offer_extended', 'interview_scheduled', 'action_required', 'application_status_change', 'recruiter_message'].includes(n.type)
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Complete your profile to attract better opportunities</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {priorityNotifications.filter(n => !n.is_read).length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {priorityNotifications.filter(n => !n.is_read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Keep your profile updated for better matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion Level</p>
              <p className="text-sm font-semibold">{completionPercent}%</p>
            </div>
            <Progress value={completionPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Add missing information like experience, preferred titles, and portfolio links to reach 100%.
            </p>
          </CardContent>
        </Card>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email} disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Snapshot</CardTitle>
            <CardDescription>Help recruiters understand your background at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentRole">Current Role / Job Title</Label>
                <Input
                  id="currentRole"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="Frontend Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentCompany">Current Company (Optional)</Label>
                <Input
                  id="currentCompany"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                  placeholder="TechCorp Inc."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry / Domain</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="IT, Healthcare, Fintech, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Job Title(s)</Label>
              <div className="flex gap-2">
                <Input
                  value={newPreferredTitle}
                  onChange={(e) => setNewPreferredTitle(e.target.value)}
                  placeholder="Add preferred job title"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPreferredTitle())}
                />
                <Button type="button" onClick={handleAddPreferredTitle}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferredJobTitles.map((title) => (
                  <Badge key={title} variant="secondary" className="cursor-pointer" onClick={() => handleRemovePreferredTitle(title)}>
                    {title} ×
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredEmploymentType">Preferred Employment Type</Label>
              <Select value={preferredEmploymentType} onValueChange={setPreferredEmploymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Experience Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>List your professional experience</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {experiences.map((exp, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title *</Label>
                      <Input
                        value={exp.job_title}
                        onChange={(e) => updateExperience(index, 'job_title', e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={exp.company_name}
                        onChange={(e) => updateExperience(index, 'company_name', e.target.value)}
                        placeholder="Google"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={exp.start_date}
                        onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={exp.end_date}
                        onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                        disabled={exp.is_current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${index}`}
                      checked={exp.is_current}
                      onCheckedChange={(checked) => updateExperience(index, 'is_current', checked)}
                    />
                    <Label htmlFor={`current-${index}`} className="cursor-pointer">I currently work here</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Description / Achievements</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Describe your role and key achievements..."
                      rows={3}
                    />
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </Card>
            ))}
            {experiences.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No experience added yet. Click "Add Experience" to get started.</p>
            )}
          </CardContent>
        </Card>

        {/* Education Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((edu, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="Stanford University"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="Bachelor's, Master's, PhD..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Major / Specialization</Label>
                    <Input
                      value={edu.major}
                      onChange={(e) => updateEducation(index, 'major', e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Year</Label>
                      <Input
                        type="number"
                        value={edu.start_year}
                        onChange={(e) => updateEducation(index, 'start_year', e.target.value)}
                        placeholder="2018"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Graduation Year</Label>
                      <Input
                        type="number"
                        value={edu.graduation_year}
                        onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                        placeholder="2022"
                      />
                    </div>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </Card>
            ))}
            {education.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No education added yet. Click "Add Education" to get started.</p>
            )}
          </CardContent>
        </Card>

        {/* Career Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Career Preferences</CardTitle>
            <CardDescription>Help recruiters understand what you're looking for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary Range (Optional)</Label>
              <Input
                id="expectedSalary"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="$80,000 - $120,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noticePeriod">Notice Period</Label>
              <Input
                id="noticePeriod"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                placeholder="2 weeks, 1 month, etc."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="relocation"
                checked={openToRelocation}
                onCheckedChange={(checked) => setOpenToRelocation(checked as boolean)}
              />
              <Label htmlFor="relocation" className="cursor-pointer">Open to Relocation</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remotePreference">Remote Preference</Label>
              <Select value={remotePreference} onValueChange={setRemotePreference}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio & Links */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio & Links</CardTitle>
            <CardDescription>Share your online presence and work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub / Behance</Label>
                <Input
                  id="github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Personal Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label>Portfolio Projects</Label>
                  <p className="text-sm text-muted-foreground">Showcase your best work</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addPortfolioProject}>
                  <Plus className="h-4 w-4 mr-2" /> Add Project
                </Button>
              </div>
              <div className="space-y-4">
                {portfolioProjects.map((proj, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Project Title *</Label>
                        <Input
                          value={proj.title}
                          onChange={(e) => updatePortfolioProject(index, 'title', e.target.value)}
                          placeholder="E-commerce Platform"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={proj.description}
                          onChange={(e) => updatePortfolioProject(index, 'description', e.target.value)}
                          placeholder="Brief description of the project..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          type="url"
                          value={proj.url}
                          onChange={(e) => updatePortfolioProject(index, 'url', e.target.value)}
                          placeholder="https://project-url.com"
                        />
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removePortfolioProject(index)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </Card>
                ))}
                {portfolioProjects.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No projects added yet. Click "Add Project" to showcase your work.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Bio</CardTitle>
            <CardDescription>Additional information about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={saveProfile} disabled={loading} className="w-full" size="lg">
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Notifications</h2>
                <p className="text-muted-foreground">Stay updated on your job applications and opportunities</p>
              </div>
              {priorityNotifications.length > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {priorityNotifications.filter(n => !n.is_read).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Unread</div>
                </div>
              )}
            </div>
          </div>

          {notificationsLoading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Loading notifications...</p>
              </CardContent>
            </Card>
          ) : priorityNotifications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="text-center py-16">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  You'll see important updates about your applications, interviews, and offers here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {priorityNotifications.map((notification) => {
                const isUnread = !notification.is_read;
                const priority = getNotificationPriority(notification.type);

                return (
                  <Card 
                    key={notification.id} 
                    className={`border-l-4 transition-all hover:shadow-lg ${
                      isUnread 
                        ? 'border-l-primary bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-primary/20' 
                        : 'border-l-muted bg-card/50'
                    } ${priority === 1 ? 'ring-2 ring-primary/20' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${
                          notification.type === 'offer_extended' ? 'bg-green-500/20' :
                          notification.type === 'interview_scheduled' ? 'bg-blue-500/20' :
                          notification.type === 'action_required' ? 'bg-orange-500/20' :
                          notification.type === 'application_status_change' ? 'bg-purple-500/20' :
                          'bg-primary/20'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-semibold text-lg text-foreground">
                                  {notification.type === 'offer_extended' && '🎉 Offer Extended'}
                                  {notification.type === 'interview_scheduled' && '📅 Interview Scheduled'}
                                  {notification.type === 'action_required' && '⚠️ Action Required'}
                                  {notification.type === 'application_status_change' && '📊 Application Status Update'}
                                  {notification.type === 'recruiter_message' && '💬 Recruiter Message'}
                                </h3>
                                {isUnread && (
                                  <Badge variant="default" className="bg-primary text-xs animate-pulse">New</Badge>
                                )}
                                {priority === 1 && (
                                  <Badge variant="destructive" className="text-xs bg-red-600">High Priority</Badge>
                                )}
                              </div>
                              <p className="text-sm text-foreground/90 mb-3 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(notification.created_at), 'PPP p')}
                                </p>
                                {isUnread && (
                                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                )}
                              </div>
                            </div>
                            {isUnread && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs hover:bg-primary/10"
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>

                          {/* Action Buttons based on notification type */}
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                            {notification.type === 'offer_extended' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleViewOfferLetter(notification)}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Offer Letter
                              </Button>
                            )}

                            {notification.type === 'interview_scheduled' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleAddToCalendar(notification)}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                              >
                                <Calendar className="h-4 w-4 mr-2" />
                                Add to Calendar
                              </Button>
                            )}

                            {notification.type === 'action_required' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  // Navigate to action page
                                  window.location.href = '/applications';
                                  markAsRead(notification.id);
                                }}
                                className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/30"
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Complete Action
                              </Button>
                            )}

                            {notification.type === 'recruiter_message' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  // Open message/response interface
                                  toast({
                                    title: 'Message',
                                    description: 'Message response feature coming soon',
                                  });
                                  markAsRead(notification.id);
                                }}
                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Respond
                              </Button>
                            )}

                            {notification.related_id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.location.href = '/applications';
                                }}
                                className="border-border hover:bg-muted"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Application
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}