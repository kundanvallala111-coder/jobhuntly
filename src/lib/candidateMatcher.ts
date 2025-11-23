/**
 * Candidate Matcher - NLP-based matching between candidates and job requirements
 */

interface CandidateProfile {
  id: string;
  full_name: string;
  skills: string[];
  experience_years: number | null;
  education: string | null;
  bio: string | null;
  resume_url: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
}

interface MatchResult {
  candidate: CandidateProfile;
  matchScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  breakdown: {
    matchedSkills: string[];
    missingSkills: string[];
    experienceGap: number | null;
  };
}

/**
 * Tokenize and normalize text
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

/**
 * Calculate cosine similarity between two text vectors
 */
function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  const allTerms = new Set([...vec1.keys(), ...vec2.keys()]);

  for (const term of allTerms) {
    const v1 = vec1.get(term) || 0;
    const v2 = vec2.get(term) || 0;
    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Create term frequency vector from text
 */
function createTermVector(text: string): Map<string, number> {
  const tokens = tokenize(text);
  const vector = new Map<string, number>();
  
  for (const token of tokens) {
    vector.set(token, (vector.get(token) || 0) + 1);
  }
  
  return vector;
}

/**
 * Calculate skill match percentage
 */
function calculateSkillMatch(candidateSkills: string[], requiredSkills: string[]): number {
  if (requiredSkills.length === 0) return 100;
  if (candidateSkills.length === 0) return 0;

  const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

  let matched = 0;
  for (const reqSkill of requiredSkillsLower) {
    // Exact match
    if (candidateSkillsLower.includes(reqSkill)) {
      matched++;
      continue;
    }
    // Partial match (contains)
    if (candidateSkillsLower.some(cs => cs.includes(reqSkill) || reqSkill.includes(cs))) {
      matched += 0.7;
      continue;
    }
    // Word-level match
    const reqWords = reqSkill.split(/[\s-_]+/);
    if (reqWords.some(word => 
      candidateSkillsLower.some(cs => cs.includes(word) && word.length > 3)
    )) {
      matched += 0.5;
    }
  }

  return (matched / requiredSkills.length) * 100;
}

/**
 * Calculate experience match
 */
function calculateExperienceMatch(candidateYears: number | null, jobDescription: string): number {
  // Extract years from job description
  const yearPatterns = [
    /(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*yrs?/gi,
    /minimum\s+of\s+(\d+)\s*years?/gi,
    /at\s+least\s+(\d+)\s*years?/gi,
  ];

  let requiredYears = 0;
  for (const pattern of yearPatterns) {
    const match = jobDescription.match(pattern);
    if (match) {
      const years = match.map(m => parseInt(m.match(/\d+/)?.[0] || '0')).filter(y => y > 0);
      if (years.length > 0) {
        requiredYears = Math.max(requiredYears, ...years);
      }
    }
  }

  if (requiredYears === 0) return 100; // No requirement specified
  if (!candidateYears) return 0;

  if (candidateYears >= requiredYears) return 100;
  if (candidateYears >= requiredYears * 0.8) return 80;
  if (candidateYears >= requiredYears * 0.6) return 60;
  if (candidateYears >= requiredYears * 0.4) return 40;
  return 20;
}

/**
 * Calculate education match using text similarity
 */
function calculateEducationMatch(candidateEducation: string | null, jobDescription: string): number {
  if (!candidateEducation) return 50; // Neutral if no education info

  const candidateVec = createTermVector(candidateEducation);
  const jobVec = createTermVector(jobDescription);

  // Look for education keywords in job description
  const educationKeywords = ['degree', 'bachelor', 'master', 'phd', 'diploma', 'certification', 'education'];
  const hasEducationRequirement = educationKeywords.some(keyword => 
    jobDescription.toLowerCase().includes(keyword)
  );

  if (!hasEducationRequirement) return 100; // No specific requirement

  const similarity = cosineSimilarity(candidateVec, jobVec);
  return Math.max(50, similarity * 100); // Minimum 50% if education exists
}

/**
 * Match a candidate to a job using NLP techniques
 */
export function matchCandidateToJob(
  candidate: CandidateProfile,
  job: Job
): MatchResult {
  // Skill matching
  const skillMatch = calculateSkillMatch(candidate.skills || [], job.required_skills || []);
  
  // Experience matching
  const experienceMatch = calculateExperienceMatch(
    candidate.experience_years,
    job.description
  );

  // Education matching
  const educationMatch = calculateEducationMatch(
    candidate.education || candidate.bio,
    job.description
  );

  // Calculate matched and missing skills
  const candidateSkillsLower = (candidate.skills || []).map(s => s.toLowerCase());
  const requiredSkillsLower = (job.required_skills || []).map(s => s.toLowerCase());
  
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of requiredSkillsLower) {
    const matched = candidateSkillsLower.some(cs => 
      cs === reqSkill || cs.includes(reqSkill) || reqSkill.includes(cs)
    );
    if (matched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  // Calculate experience gap
  const yearPatterns = [
    /(\d+)\+?\s*years?/gi,
    /(\d+)\+?\s*yrs?/gi,
    /minimum\s+of\s+(\d+)\s*years?/gi,
  ];
  let requiredYears = 0;
  for (const pattern of yearPatterns) {
    const match = job.description.match(pattern);
    if (match) {
      const years = match.map(m => parseInt(m.match(/\d+/)?.[0] || '0')).filter(y => y > 0);
      if (years.length > 0) {
        requiredYears = Math.max(requiredYears, ...years);
      }
    }
  }
  const experienceGap = candidate.experience_years && requiredYears > 0
    ? requiredYears - candidate.experience_years
    : null;

  // Weighted overall match score
  const matchScore = (
    skillMatch * 0.5 +      // 50% weight on skills
    experienceMatch * 0.3 +  // 30% weight on experience
    educationMatch * 0.2     // 20% weight on education
  );

  return {
    candidate,
    matchScore: Math.round(matchScore * 100) / 100,
    skillMatch: Math.round(skillMatch * 100) / 100,
    experienceMatch: Math.round(experienceMatch * 100) / 100,
    educationMatch: Math.round(educationMatch * 100) / 100,
    breakdown: {
      matchedSkills,
      missingSkills,
      experienceGap,
    },
  };
}

/**
 * Match multiple candidates to a job and return ranked results
 */
export function matchCandidatesToJob(
  candidates: CandidateProfile[],
  job: Job
): MatchResult[] {
  const matches = candidates.map(candidate => matchCandidateToJob(candidate, job));
  
  // Sort by match score (descending)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}



