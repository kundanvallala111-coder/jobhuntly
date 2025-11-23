import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { parseResumeWithAffinda, type ParsedResume } from '@/lib/affinda';
import { matchResumeToJobs, JobMatchResult } from '@/lib/jobMatcher';
import { Upload, FileText, TrendingUp, CheckCircle2, XCircle, GraduationCap, Briefcase, Award, X, User } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SkillGapAnalyzer from '@/models/SkillGapAnalyzer';

interface Job {
  id: string;
  title: string;
  description: string;
  required_skills: string[] | null;
  company_name: string | null;
  location: string;
  job_type: string;
  salary_range: string | null;
}

export default function ResumeMatcher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<JobMatchResult[]>([]);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [profileData, setProfileData] = useState<ParsedResume | null>(null);
  const [usingProfileData, setUsingProfileData] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const analyzer = new SkillGapAnalyzer();

  useEffect(() => {
    loadJobs();
    loadProfileData();
  }, [user]);

  useEffect(() => {
    // Automatically use profile data when it's loaded and available
    if (profileData && !parsedData && !usingProfileData && jobs.length > 0) {
      setUsingProfileData(true);
      const matchResults = matchResumeToJobs(profileData, jobs);
      setMatches(matchResults);
    }
  }, [profileData, jobs.length, parsedData, usingProfileData]);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading jobs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  const loadProfileData = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      // Load candidate profile
      const { data: candidateProfile, error: profileError } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      // Load experiences
      const { data: experiencesData, error: expError } = await supabase
        .from('candidate_experiences')
        .select('*')
        .eq('candidate_id', user.id)
        .order('start_date', { ascending: false });

      if (expError) throw expError;

      // Load education
      const { data: educationData, error: eduError } = await supabase
        .from('candidate_education')
        .select('*')
        .eq('candidate_id', user.id)
        .order('graduation_year', { ascending: false });

      if (eduError) throw eduError;

      // Convert profile data to ParsedResume format
      if (candidateProfile) {
        const profileResume: ParsedResume = {
          skills: candidateProfile.skills || [],
          experience: {
            years: candidateProfile.experience_years || 0,
            positions: (experiencesData || []).map((exp) => {
              const startDate = exp.start_date ? new Date(exp.start_date) : new Date();
              const endDate = exp.end_date ? new Date(exp.end_date) : null;
              const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              const endStr = endDate 
                ? endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Present';
              
              return {
                title: exp.job_title,
                company: exp.company_name,
                duration: `${startStr} - ${endStr}`,
                description: exp.description || '',
              };
            }),
          },
          education: (educationData || []).map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            field: edu.major || '',
            year: edu.graduation_year?.toString() || '',
          })),
          summary: candidateProfile.bio || undefined,
        };

        setProfileData(profileResume);
      }
    } catch (error: any) {
      console.error('Error loading profile data:', error);
      // Don't show error toast - profile might not exist yet
    } finally {
      setLoadingProfile(false);
    }
  };


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size exceeds 10MB limit.',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFile(file);
    setFileName(file.name);
    setParsedData(null);
    setMatches([]);
    setUsingProfileData(false);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileName('');
    setParsedData(null);
    setMatches([]);
    setUsingProfileData(false);
  };

  const handleParseAndMatch = async () => {
    if (!uploadedFile) {
      toast({
        title: 'Resume required',
        description: 'Please upload a resume file before parsing.',
        variant: 'destructive',
      });
      return;
    }

    setParsing(true);
    try {
      // Parse resume with Affinda
      const parsed = await parseResumeWithAffinda(uploadedFile);
      setParsedData(parsed);
      setUsingProfileData(false); // Clear profile data flag

      // Match against jobs
      const matchResults = matchResumeToJobs(parsed, jobs);
      setMatches(matchResults);

      toast({
        title: 'Resume parsed successfully!',
        description: `Found ${parsed.skills.length} skills, ${parsed.experience.years} years of experience, and ${parsed.education.length} education entries.`,
      });
    } catch (error: any) {
      toast({
        title: 'Affinda parsing error',
        description: error?.message || 'Failed to parse the resume with Affinda.',
        variant: 'destructive',
      });
    } finally {
      setParsing(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBadgeVariant = (percentage: number): "default" | "secondary" | "destructive" | "outline" => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  const buildCandidateProfileText = (resume: ParsedResume) => {
    const skills = resume.skills.join(', ');
    const experienceSummary = resume.experience.positions.map((pos) => `${pos.title} at ${pos.company}`).join('; ');
    const educationSummary = resume.education.map((edu) => `${edu.degree} in ${edu.field || 'General'}`).join('; ');
    return `
      Skills: ${skills}.
      Experience: ${experienceSummary}.
      Education: ${educationSummary}.
    `;
  };

  const handleAnalyzeSkillGap = () => {
    const dataToUse = usingProfileData ? profileData : parsedData;
    
    if (!dataToUse) {
      toast({
        title: 'No data available',
        description: usingProfileData 
          ? 'Please load your profile data first or parse a resume.'
          : 'Please upload and parse a resume or use your profile data first.',
        variant: 'destructive',
      });
      return;
    }
    if (!jobTitleInput.trim() || !jobDescriptionInput.trim()) {
      toast({
        title: 'Job description required',
        description: 'Add a job title and description to analyze.',
        variant: 'destructive',
      });
      return;
    }

    const tjd = `${jobTitleInput}\n${jobDescriptionInput}`;
    const crp = buildCandidateProfileText(dataToUse);
    const result = analyzer.analyze(tjd, crp);
    setAnalysisResult(result);
  };

  const handleUpdateProfileFromResume = async () => {
    if (!parsedData || !user) {
      toast({
        title: 'Resume data required',
        description: 'Please parse a resume first.',
        variant: 'destructive',
      });
      return;
    }

    setUpdatingProfile(true);
    try {
      // Update profiles table (name, phone, location)
      const profileUpdates: any = {};
      if (parsedData.name) profileUpdates.full_name = parsedData.name;
      if (parsedData.phone) profileUpdates.phone = parsedData.phone;
      if (parsedData.location) profileUpdates.location = parsedData.location;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      // Update candidate_profiles table
      const candidateUpdates: any = {
        skills: parsedData.skills,
        experience_years: parsedData.experience.years,
        bio: parsedData.summary || null,
      };

      if (parsedData.experience.positions.length > 0) {
        candidateUpdates.current_role = parsedData.experience.positions[0].title || null;
        candidateUpdates.current_company = parsedData.experience.positions[0].company || null;
      }

      // Upsert candidate profile
      const { error: candidateError } = await supabase
        .from('candidate_profiles')
        .upsert({
          user_id: user.id,
          ...candidateUpdates,
        }, {
          onConflict: 'user_id'
        });

      if (candidateError) throw candidateError;

      // Delete existing experiences and education
      await supabase
        .from('candidate_experiences')
        .delete()
        .eq('candidate_id', user.id);

      await supabase
        .from('candidate_education')
        .delete()
        .eq('candidate_id', user.id);

      // Insert new experiences from resume
      if (parsedData.experience.positions.length > 0) {
        const experiencesToInsert = parsedData.experience.positions.map((pos) => {
          // Parse duration to extract dates
          const duration = pos.duration || '';
          const dateMatch = duration.match(/(\w+\s+\d{4})/g);
          let startDate = new Date().toISOString().split('T')[0];
          let endDate: string | null = null;

          if (dateMatch && dateMatch.length > 0) {
            try {
              const startDateStr = dateMatch[0];
              const start = new Date(startDateStr);
              if (!isNaN(start.getTime())) {
                startDate = start.toISOString().split('T')[0];
              }
            } catch (e) {
              // Use default
            }
          }

          if (dateMatch && dateMatch.length > 1) {
            try {
              const endDateStr = dateMatch[1];
              const end = new Date(endDateStr);
              if (!isNaN(end.getTime())) {
                endDate = end.toISOString().split('T')[0];
              }
            } catch (e) {
              // Use default
            }
          } else if (duration.toLowerCase().includes('present') || duration.toLowerCase().includes('current')) {
            endDate = null; // Current position
          }

          return {
            candidate_id: user.id,
            job_title: pos.title,
            company_name: pos.company,
            start_date: startDate,
            end_date: endDate,
            description: pos.description || null,
          };
        });

        const { error: expError } = await supabase
          .from('candidate_experiences')
          .insert(experiencesToInsert);

        if (expError) throw expError;
      }

      // Insert new education from resume
      if (parsedData.education.length > 0) {
        const educationToInsert = parsedData.education.map((edu) => {
          const year = edu.year ? parseInt(edu.year) : null;
          return {
            candidate_id: user.id,
            institution: edu.institution,
            degree: edu.degree,
            major: edu.field || null,
            graduation_year: year,
            start_year: year ? year - 4 : null, // Estimate start year
          };
        });

        const { error: eduError } = await supabase
          .from('candidate_education')
          .insert(educationToInsert);

        if (eduError) throw eduError;
      }

      toast({
        title: 'Profile updated successfully!',
        description: 'Your profile has been updated with information from your resume.',
      });
      
      // Reload profile data and switch to using it
      await loadProfileData();
      setParsedData(null);
      setUsingProfileData(false); // Reset to trigger auto-use of new profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error?.message || 'Failed to update profile from resume.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Resume Matcher</h1>
        <p className="text-muted-foreground mt-2">
          Upload or paste your resume to find matching jobs with detailed match analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Resume Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Input
            </CardTitle>
            <CardDescription>
              Using your profile data automatically. You can also upload a resume to parse and update your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingProfile && (
              <div className="p-3 bg-muted/50 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Loading profile data...</p>
              </div>
            )}
            
            {usingProfileData && profileData && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Using Profile Data
                </p>
                <p className="text-xs text-muted-foreground">
                  {profileData.skills.length} skills • {profileData.experience.years} years exp • {profileData.education.length} education entries
                </p>
              </div>
            )}

            {profileData && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or parse a resume</span>
                </div>
              </div>
            )}
            {/* File Upload Area */}
            <div className="space-y-3">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={parsing}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {parsing ? (
                    <div className="space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Parsing resume with Affinda...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-sm font-medium">{fileName}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="mt-2"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload resume</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>

              {uploadedFile && !parsing && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded text-left">
                  File ready: {fileName}
                </div>
              )}
            </div>

            <Button
              onClick={handleParseAndMatch}
              disabled={!uploadedFile || parsing || loadingJobs}
              className="w-full"
            >
              {parsing ? (
                <>Parsing and Matching...</>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Parse & Match Jobs
                </>
              )}
            </Button>

            {/* Profile Data Preview */}
            {usingProfileData && profileData && (
              <Card className="mt-4 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Skills ({profileData.skills.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {profileData.skills.slice(0, 10).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profileData.skills.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{profileData.skills.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Experience:</p>
                    <p className="text-sm text-muted-foreground">
                      {profileData.experience.years} years, {profileData.experience.positions.length} positions
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Education:</p>
                    <p className="text-sm text-muted-foreground">
                      {profileData.education.length} entries
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parsed Data Preview */}
            {parsedData && !usingProfileData && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Parsed Resume Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Skills ({parsedData.skills.length}):</p>
                    <div className="flex flex-wrap gap-1">
                      {parsedData.skills.slice(0, 10).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {parsedData.skills.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{parsedData.skills.length - 10} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Experience:</p>
                    <p className="text-sm text-muted-foreground">
                      {parsedData.experience.years} years, {parsedData.experience.positions.length} positions
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Education:</p>
                    <p className="text-sm text-muted-foreground">
                      {parsedData.education.length} entries found
                    </p>
                  </div>
                  <Button
                    onClick={handleUpdateProfileFromResume}
                    disabled={updatingProfile}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    {updatingProfile ? (
                      <>Updating Profile...</>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Update Profile from Resume
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Match Results */}
        <div className="space-y-6">
          {matches.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Match Results ({matches.length} jobs)
                  </CardTitle>
                  <CardDescription>
                    Jobs ranked by match percentage (best matches first)
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.jobId} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{match.jobTitle}</CardTitle>
                          <CardDescription className="mt-1">
                            {match.companyName}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getMatchColor(match.overallMatch)}`}>
                            {match.overallMatch}%
                          </div>
                          <Badge variant={getMatchBadgeVariant(match.overallMatch)} className="mt-1">
                            {match.overallMatch >= 80 ? 'Excellent' : match.overallMatch >= 60 ? 'Good' : 'Fair'}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={match.overallMatch} className="mt-4" />
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {/* Skills Match */}
                        <AccordionItem value="skills">
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4" />
                              <span>Skills Match: {match.skillsMatch.percentage}%</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {match.skillsMatch.matched.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Matched Skills ({match.skillsMatch.matched.length})
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {match.skillsMatch.matched.map((skill, idx) => (
                                      <Badge key={idx} variant="default" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {match.skillsMatch.missing.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    Missing Skills ({match.skillsMatch.missing.length})
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {match.skillsMatch.missing.map((skill, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Experience Match */}
                        <AccordionItem value="experience">
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              <span>Experience Match: {match.experienceMatch.percentage}%</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold">Your Experience:</span>{' '}
                                {match.experienceMatch.candidateYears} years
                              </p>
                              {match.experienceMatch.requiredYears && (
                                <p>
                                  <span className="font-semibold">Required:</span>{' '}
                                  {match.experienceMatch.requiredYears}+ years
                                </p>
                              )}
                              {!match.experienceMatch.requiredYears && (
                                <p className="text-muted-foreground">
                                  No specific experience requirement mentioned
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Education Match */}
                        <AccordionItem value="education">
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>Education Match: {match.educationMatch.percentage}%</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {match.educationMatch.matched.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    Matched Requirements
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {match.educationMatch.matched.map((edu, idx) => (
                                      <Badge key={idx} variant="default" className="text-xs">
                                        {edu}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {match.educationMatch.missing.length > 0 && (
                                <div>
                                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    Missing Requirements
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {match.educationMatch.missing.map((edu, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {edu}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {match.educationMatch.matched.length === 0 && match.educationMatch.missing.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                  No specific education requirements mentioned
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <Button
                        className="w-full mt-4"
                        onClick={async () => {
                          if (!user) {
                            toast({
                              title: 'Authentication required',
                              description: 'Please log in to apply for jobs.',
                              variant: 'destructive',
                            });
                            return;
                          }

                          try {
                            const { error } = await supabase.from('applications').insert({
                              job_id: match.jobId,
                              candidate_id: user.id,
                              status: 'pending',
                            });

                            if (error) throw error;

                            toast({
                              title: 'Application submitted!',
                              description: `You've applied to ${match.jobTitle} at ${match.companyName}`,
                            });
                          } catch (error: any) {
                            if (error.code === '23505') {
                              toast({
                                title: 'Already applied',
                                description: 'You have already applied to this job.',
                                variant: 'destructive',
                              });
                            } else {
                              toast({
                                title: 'Application failed',
                                description: error.message,
                                variant: 'destructive',
                              });
                            }
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {parsing
                    ? 'Parsing your resume and matching jobs...'
                    : usingProfileData
                    ? 'Use your profile data or parse a resume to see job matches'
                    : 'Parse your resume or use your profile data to see job matches ranked by compatibility'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analyzer</CardTitle>
          <CardDescription>Paste the target job details and see fit score + recommended actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                placeholder="Senior Full Stack Developer"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              rows={6}
              value={jobDescriptionInput}
              onChange={(e) => setJobDescriptionInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {(usingProfileData && profileData) || (!usingProfileData && parsedData) ? (
              <div className="text-xs text-muted-foreground mb-2">
                Using: {usingProfileData ? 'Profile Data' : 'Parsed Resume'}
              </div>
            ) : null}
            <Button 
              onClick={handleAnalyzeSkillGap} 
              disabled={!parsedData && !profileData}
              className="w-full"
            >
              Run Skill Gap Analyzer
            </Button>
          </div>
          {analysisResult && (
            <div className="space-y-6 mt-6">
              <div className="bg-card rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase text-muted-foreground">Overall Fit Score</p>
                    <p className="text-3xl font-semibold">{analysisResult.summary.fitScore}%</p>
                  </div>
                  <Badge>{analysisResult.summary.recommendation}</Badge>
                </div>
                <Progress value={analysisResult.summary.fitScore} className="mt-4" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Missing Must-Have Skills</CardTitle>
                    <CardDescription>Critical gaps that should be addressed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysisResult.gapAnalysis.Missing_Required_Skills['Must-Have'].length === 0 ? (
                      <p className="text-sm text-muted-foreground">No critical gaps detected.</p>
                    ) : (
                      analysisResult.gapAnalysis.Missing_Required_Skills['Must-Have'].map((item: any) => (
                        <Badge key={item.skill} variant="destructive">
                          {item.skill}
                        </Badge>
                      ))
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Weak Matches</CardTitle>
                    <CardDescription>Skills to strengthen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysisResult.gapAnalysis.Weak_Match_Skills['Must-Have'].length === 0 &&
                    analysisResult.gapAnalysis.Weak_Match_Skills['Important'].length === 0 ? (
                      <p className="text-sm text-muted-foreground">No weak matches detected.</p>
                    ) : (
                      ['Must-Have', 'Important'].map((priority) =>
                        analysisResult.gapAnalysis.Weak_Match_Skills[priority].map((item: any) => (
                          <div key={`${priority}-${item.skill}`} className="text-sm">
                            <p className="font-semibold">{item.skill}</p>
                            <p className="text-muted-foreground">
                              Match score: {Math.round(item.score * 100)}% (matched with {item.matchedWith || 'N/A'})
                            </p>
                          </div>
                        ))
                      )
                    )}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Actionable Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.actionPlan.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recommendations needed.</p>
                  )}
                  {analysisResult.actionPlan.slice(0, 4).map((action: any, idx: number) => (
                    <div key={idx} className="border rounded-xl p-3">
                      <p className="text-sm uppercase tracking-wide text-muted-foreground">{action.priority}</p>
                      <p className="text-lg font-semibold">{action.skill}</p>
                      <p className="text-sm text-muted-foreground mt-1">{action.resumeOptimization}</p>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2">
                        {action.developmentActions.slice(0, 2).map((dev: string, devIdx: number) => (
                          <li key={devIdx}>{dev}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
