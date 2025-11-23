// lib/affinda.ts - CORRECTED VERSION with proper types
import { Database } from '@/integrations/supabase/types';

// Affinda-specific types
export interface ParsedResume {
  skills: string[];
  experience: {
    years: number;
    positions: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
  };
  education: Array<{
    degree: string;
    institution: string;
    field: string;
    year: string;
  }>;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

interface AffindaSkill {
  name: string;
  level?: string;
}

interface AffindaDates {
  startDate?: string;
  endDate?: string;
  completionDate?: string;
}

interface AffindaWorkExperience {
  jobTitle?: string;
  title?: string;
  organization?: string;
  company?: string;
  jobDescription?: string;
  description?: string;
  dates?: AffindaDates;
  startDate?: string;
  endDate?: string;
}

interface AffindaEducation {
  accreditation?: {
    education?: string;
    educationLevel?: string;
  };
  degree?: string;
  organization?: string;
  institution?: string;
  dates?: AffindaDates;
  graduationDate?: string;
  field?: string;
}

interface AffindaResponse {
  data: {
    name?: { raw?: string } | string;
    emails?: string[];
    email?: string;
    phoneNumbers?: string[];
    phone?: string;
    location?: { formatted?: string } | string;
    summary?: string;
    objective?: string;
    skills?: AffindaSkill[] | string[];
    workExperience?: AffindaWorkExperience[];
    education?: AffindaEducation[];
  };
}

const AFFINDA_API_KEY = import.meta.env.VITE_AFFINDA_API_KEY;
const AFFINDA_WORKSPACE_ID = import.meta.env.VITE_AFFINDA_WORKSPACE_ID;

if (!AFFINDA_API_KEY) {
  console.warn('⚠️ AFFINDA_API_KEY is not set in environment variables');
}

if (!AFFINDA_WORKSPACE_ID) {
  console.warn('⚠️ AFFINDA_WORKSPACE_ID is not set in environment variables');
}

export async function parseResumeWithAffinda(file: File): Promise<ParsedResume> {
  if (!AFFINDA_API_KEY) {
    throw new Error('Affinda API key is not configured. Please set VITE_AFFINDA_API_KEY in your .env file');
  }

  if (!AFFINDA_WORKSPACE_ID) {
    throw new Error('Affinda workspace ID is not configured. Please set VITE_AFFINDA_WORKSPACE_ID in your .env file');
  }

  try {
    console.log('📄 Starting resume parse with Affinda...');
    console.log('File:', file.name, 'Size:', file.size, 'bytes');

    // Method 1: Using FormData (Recommended for file uploads)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspace', AFFINDA_WORKSPACE_ID);
    formData.append('wait', 'true'); // Wait for parsing to complete

    const response = await fetch('https://api.affinda.com/v3/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
        // Don't set Content-Type - browser sets it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Affinda API error:', response.status, errorText);
      
      // Handle specific error codes
      if (response.status === 401) {
        throw new Error('Invalid Affinda API key. Please check your credentials.');
      } else if (response.status === 403) {
        throw new Error('Access forbidden. Check your workspace ID and API permissions.');
      } else if (response.status === 400) {
        throw new Error('Invalid request. Make sure the file format is supported.');
      }
      
      throw new Error(`Affinda API error (${response.status}): ${errorText}`);
    }

    const documentData: AffindaResponse = await response.json();
    console.log('✅ Affinda parsing successful');
    console.log('Raw response:', documentData);

    // Extract and structure the parsed data
    const parsed = extractResumeData(documentData);
    console.log('📊 Extracted data:', parsed);
    
    return parsed;

  } catch (error) {
    console.error('❌ Resume parsing error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to parse resume. Please try again.');
  }
}

// Alternative: Using base64 (if FormData doesn't work)
export async function parseResumeWithBase64(file: File): Promise<ParsedResume> {
  if (!AFFINDA_API_KEY || !AFFINDA_WORKSPACE_ID) {
    throw new Error('Affinda credentials not configured');
  }

  try {
    const base64Data = await fileToBase64(file);

    const response = await fetch('https://api.affinda.com/v3/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64Data,
        fileName: file.name,
        workspace: AFFINDA_WORKSPACE_ID,
        wait: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Affinda error:', errorText);
      throw new Error(`Affinda API error: ${response.status}`);
    }

    const documentData: AffindaResponse = await response.json();
    return extractResumeData(documentData);

  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
}

// Helper: Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Helper: Extract structured data from Affinda response
function extractResumeData(affindaResponse: AffindaResponse): ParsedResume {
  const data = affindaResponse.data;

  // Extract skills
  const skills: string[] = [];
  if (data.skills) {
    data.skills.forEach((skill) => {
      if (typeof skill === 'string') {
        skills.push(skill);
      } else if (skill.name) {
        skills.push(skill.name);
      }
    });
  }

  // Extract work experience
  const workExperience = data.workExperience || [];
  const positions = workExperience.map((exp) => {
    const startDate = exp.dates?.startDate || exp.startDate;
    const endDate = exp.dates?.endDate || exp.endDate;
    const isCurrent = !endDate; // If no end date, assume current position
    
    return {
      title: exp.jobTitle || exp.title || 'Unknown Position',
      company: exp.organization || exp.company || 'Unknown Company',
      duration: formatDuration(startDate, endDate, isCurrent),
      description: exp.jobDescription || exp.description || '',
    };
  });

  // Calculate total years of experience
  const totalYears = calculateTotalExperience(workExperience);

  // Extract education
  const educationList = data.education || [];
  const education = educationList.map((edu) => {
    const graduationDate = edu.dates?.completionDate || edu.graduationDate;
    const year = graduationDate ? new Date(graduationDate).getFullYear().toString() : '';
    
    return {
      degree: edu.accreditation?.education || edu.degree || 'Unknown Degree',
      institution: edu.organization || edu.institution || 'Unknown Institution',
      field: edu.accreditation?.educationLevel || edu.field || '',
      year: year,
    };
  });

  // Extract personal info
  const nameObj = data.name;
  const name = typeof nameObj === 'object' && nameObj?.raw ? nameObj.raw : 
               typeof nameObj === 'string' ? nameObj : '';
  
  const email = Array.isArray(data.emails) && data.emails.length > 0 ? data.emails[0] : 
                data.email || '';
  
  const phone = Array.isArray(data.phoneNumbers) && data.phoneNumbers.length > 0 ? data.phoneNumbers[0] : 
                data.phone || '';
  
  const locationObj = data.location;
  const location = typeof locationObj === 'object' && locationObj?.formatted ? locationObj.formatted :
                   typeof locationObj === 'string' ? locationObj : '';
  
  const summary = data.summary || data.objective || '';

  return {
    skills,
    experience: {
      years: totalYears,
      positions,
    },
    education,
    name,
    email,
    phone,
    location,
    summary,
  };
}

// Helper: Calculate total years of experience
function calculateTotalExperience(workExperience: AffindaWorkExperience[]): number {
  if (!workExperience || workExperience.length === 0) return 0;

  let totalMonths = 0;

  workExperience.forEach((exp) => {
    const startDate = exp.dates?.startDate || exp.startDate;
    const endDate = exp.dates?.endDate || exp.endDate;

    if (!startDate) return;

    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();

      const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      totalMonths += Math.max(0, months);
    } catch (error) {
      console.warn('Error calculating experience for:', exp);
    }
  });

  return Math.round((totalMonths / 12) * 10) / 10;
}

// Helper: Format date range as string
function formatDuration(startDate: string | undefined, endDate: string | undefined, isCurrent: boolean): string {
  if (!startDate) return 'Unknown';
  
  try {
    const start = new Date(startDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (isCurrent || !endDate) {
      return `${startStr} - Present`;
    }
    
    const end = new Date(endDate);
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  } catch (error) {
    return startDate || 'Unknown';
  }
}

// Test function to verify API connection
export async function testAffindaConnection(): Promise<{ success: boolean; message: string }> {
  if (!AFFINDA_API_KEY) {
    return { success: false, message: 'API key not configured' };
  }

  try {
    const response = await fetch('https://api.affinda.com/v3/workspaces', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AFFINDA_API_KEY}`,
      },
    });

    if (!response.ok) {
      return { 
        success: false, 
        message: `Connection failed: ${response.status} ${response.statusText}` 
      };
    }

    const workspaces = await response.json();
    console.log('✅ Available workspaces:', workspaces);
    
    return { 
      success: true, 
      message: `Connected! Found ${workspaces.results?.length || 0} workspace(s)` 
    };

  } catch (error) {
    console.error('Connection test error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

// Helper: Map ParsedResume to candidate_profiles table structure
export function mapToCandidateProfile(
  parsed: ParsedResume,
  userId: string
): Database['public']['Tables']['candidate_profiles']['Insert'] {
  return {
    user_id: userId,
    skills: parsed.skills,
    experience_years: parsed.experience.years,
    current_role: parsed.experience.positions[0]?.title || null,
    current_company: parsed.experience.positions[0]?.company || null,
    education: parsed.education.map(e => `${e.degree} - ${e.institution}`).join('; ') || null,
    bio: parsed.summary || null,
    linkedin_url: null,
    github_url: null,
    website_url: null,
    // Add other fields as needed
  };
}