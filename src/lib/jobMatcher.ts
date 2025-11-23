/**
 * Job Matcher - Calculates match percentages between resume and jobs
 */

import { ParsedResume } from './resumeParser';

export interface JobMatchResult {
  jobId: string;
  jobTitle: string;
  companyName: string;
  overallMatch: number; // 0-100
  skillsMatch: {
    percentage: number;
    matched: string[];
    missing: string[];
  };
  experienceMatch: {
    percentage: number;
    candidateYears: number;
    requiredYears?: number;
  };
  educationMatch: {
    percentage: number;
    matched: string[];
    missing: string[];
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  required_skills: string[] | null;
  company_name: string | null;
  [key: string]: any;
}

/**
 * Normalize strings for comparison (lowercase, trim, remove special chars)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Calculate similarity between two strings (simple word overlap)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  if (normalized1 === normalized2) return 1.0;
  
  const words1 = new Set(normalized1.split(/\s+/));
  const words2 = new Set(normalized2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Check if two skills match (with fuzzy matching)
 */
function skillsMatch(skill1: string, skill2: string, threshold: number = 0.7): boolean {
  const normalized1 = normalizeString(skill1);
  const normalized2 = normalizeString(skill2);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  // Similarity check
  const similarity = calculateSimilarity(skill1, skill2);
  return similarity >= threshold;
}

/**
 * Calculate skills match percentage
 */
function calculateSkillsMatch(
  candidateSkills: string[],
  requiredSkills: string[]
): {
  percentage: number;
  matched: string[];
  missing: string[];
} {
  if (requiredSkills.length === 0) {
    return {
      percentage: 100,
      matched: [],
      missing: [],
    };
  }
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  // Check each required skill against candidate skills
  for (const requiredSkill of requiredSkills) {
    let found = false;
    
    for (const candidateSkill of candidateSkills) {
      if (skillsMatch(candidateSkill, requiredSkill)) {
        matched.push(requiredSkill);
        found = true;
        break;
      }
    }
    
    if (!found) {
      missing.push(requiredSkill);
    }
  }
  
  const percentage = (matched.length / requiredSkills.length) * 100;
  
  return {
    percentage: Math.round(percentage),
    matched,
    missing,
  };
}

/**
 * Extract years of experience from job description
 */
function extractRequiredExperience(jobDescription: string): number | undefined {
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/i,
    /minimum\s+of\s+(\d+)\s*(?:years?|yrs?)/i,
    /at\s+least\s+(\d+)\s*(?:years?|yrs?)/i,
    /(\d+)[-–]\d+\s*(?:years?|yrs?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      return parseInt(match[1]);
    }
  }
  
  return undefined;
}

/**
 * Calculate experience match percentage
 */
function calculateExperienceMatch(
  candidateYears: number,
  jobDescription: string
): {
  percentage: number;
  candidateYears: number;
  requiredYears?: number;
} {
  const requiredYears = extractRequiredExperience(jobDescription);
  
  if (!requiredYears) {
    // If no requirement specified, give full points if candidate has any experience
    return {
      percentage: candidateYears > 0 ? 100 : 0,
      candidateYears,
      requiredYears: undefined,
    };
  }
  
  if (candidateYears >= requiredYears) {
    return {
      percentage: 100,
      candidateYears,
      requiredYears,
    };
  }
  
  // Partial match: percentage based on how close they are
  const percentage = Math.round((candidateYears / requiredYears) * 100);
  return {
    percentage: Math.min(percentage, 100),
    candidateYears,
    requiredYears,
  };
}

/**
 * Extract education requirements from job description
 */
function extractEducationRequirements(jobDescription: string): string[] {
  const requirements: string[] = [];
  const lowerDescription = jobDescription.toLowerCase();
  
  const degreePatterns = [
    /(?:bachelor|b\.?s\.?|b\.?a\.?|b\.?e\.?|b\.?tech)/i,
    /(?:master|m\.?s\.?|m\.?a\.?|m\.?e\.?|m\.?tech|m\.?b\.?a|mba)/i,
    /(?:ph\.?d|doctorate|doctoral)/i,
    /(?:associate|a\.?a\.?|a\.?s\.?)/i,
  ];
  
  degreePatterns.forEach(pattern => {
    if (pattern.test(lowerDescription)) {
      const match = lowerDescription.match(pattern);
      if (match) {
        requirements.push(match[0]);
      }
    }
  });
  
  return requirements;
}

/**
 * Calculate education match percentage
 */
function calculateEducationMatch(
  candidateEducation: Array<{ degree: string; institution: string; field: string; year: string }>,
  jobDescription: string
): {
  percentage: number;
  matched: string[];
  missing: string[];
} {
  const requiredEducation = extractEducationRequirements(jobDescription);
  
  if (requiredEducation.length === 0) {
    return {
      percentage: 100,
      matched: [],
      missing: [],
    };
  }
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  // Check each required education level
  for (const required of requiredEducation) {
    let found = false;
    
    for (const candidate of candidateEducation) {
      const candidateDegree = normalizeString(candidate.degree);
      const requiredDegree = normalizeString(required);
      
      if (
        candidateDegree.includes(requiredDegree) ||
        requiredDegree.includes(candidateDegree) ||
        calculateSimilarity(candidateDegree, requiredDegree) >= 0.6
      ) {
        matched.push(required);
        found = true;
        break;
      }
    }
    
    if (!found) {
      missing.push(required);
    }
  }
  
  const percentage = requiredEducation.length > 0
    ? Math.round((matched.length / requiredEducation.length) * 100)
    : 100;
  
  return {
    percentage,
    matched,
    missing,
  };
}

/**
 * Calculate overall match percentage
 * Weighted: Skills 50%, Experience 30%, Education 20%
 */
function calculateOverallMatch(
  skillsMatch: number,
  experienceMatch: number,
  educationMatch: number
): number {
  const weightedScore =
    skillsMatch * 0.5 +
    experienceMatch * 0.3 +
    educationMatch * 0.2;
  
  return Math.round(weightedScore);
}

/**
 * Match a parsed resume against a single job
 */
export function matchResumeToJob(
  parsedResume: ParsedResume,
  job: Job
): JobMatchResult {
  const requiredSkills = job.required_skills || [];
  
  // Calculate individual match components
  const skillsMatchResult = calculateSkillsMatch(
    parsedResume.skills,
    requiredSkills
  );
  
  const experienceMatchResult = calculateExperienceMatch(
    parsedResume.experience.years,
    job.description
  );
  
  const educationMatchResult = calculateEducationMatch(
    parsedResume.education,
    job.description
  );
  
  // Calculate overall match
  const overallMatch = calculateOverallMatch(
    skillsMatchResult.percentage,
    experienceMatchResult.percentage,
    educationMatchResult.percentage
  );
  
  return {
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.company_name || 'Unknown Company',
    overallMatch,
    skillsMatch: skillsMatchResult,
    experienceMatch: experienceMatchResult,
    educationMatch: educationMatchResult,
  };
}

/**
 * Match a parsed resume against multiple jobs and return ranked results
 */
export function matchResumeToJobs(
  parsedResume: ParsedResume,
  jobs: Job[]
): JobMatchResult[] {
  const matches = jobs.map(job => matchResumeToJob(parsedResume, job));
  
  // Sort by overall match percentage (descending)
  return matches.sort((a, b) => b.overallMatch - a.overallMatch);
}






