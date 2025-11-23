/**
 * Resume Parser - Extracts skills, experience, and education from resume text
 */

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
}

// Common technical skills keywords
const TECHNICAL_SKILLS = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'html', 'css', 'sql', 'r', 'matlab', 'scala', 'perl', 'shell', 'bash',
  
  // Frameworks & Libraries
  'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
  'next.js', 'nuxt', 'svelte', 'ember', 'backbone', 'jquery',
  
  // Databases
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite', 'dynamodb',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible',
  'git', 'github', 'gitlab', 'bitbucket',
  
  // Tools & Technologies
  'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'devops', 'machine learning',
  'ai', 'data science', 'big data', 'blockchain', 'cybersecurity',
  
  // Design & Frontend
  'ui/ux', 'figma', 'adobe', 'photoshop', 'illustrator', 'sketch',
  
  // Testing
  'jest', 'mocha', 'cypress', 'selenium', 'unit testing', 'integration testing',
  
  // Mobile
  'react native', 'flutter', 'ios', 'android', 'mobile development',
];

// Soft skills keywords
const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
  'project management', 'time management', 'collaboration', 'mentoring', 'presentation',
  'negotiation', 'customer service', 'analytical', 'creative', 'adaptable',
];

// Education degree patterns
const DEGREE_PATTERNS = [
  /(bachelor|b\.?s\.?|b\.?a\.?|b\.?e\.?|b\.?tech|bachelor's)/i,
  /(master|m\.?s\.?|m\.?a\.?|m\.?e\.?|m\.?tech|m\.?b\.?a|master's|mba)/i,
  /(ph\.?d|doctorate|doctoral)/i,
  /(associate|a\.?a\.?|a\.?s\.?)/i,
  /(diploma|certificate)/i,
];

// Extract skills from resume text
export function extractSkills(resumeText: string): string[] {
  const skills: Set<string> = new Set();
  const lowerText = resumeText.toLowerCase();
  
  // Check for technical skills
  TECHNICAL_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      skills.add(skill);
    }
  });
  
  // Check for soft skills
  SOFT_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      skills.add(skill);
    }
  });
  
  // Look for skills section (common patterns)
  const skillsSectionPatterns = [
    /skills?:?\s*[:\-]?\s*([^\n]+(?:\n[^\n]+){0,10})/i,
    /technical\s+skills?:?\s*[:\-]?\s*([^\n]+(?:\n[^\n]+){0,10})/i,
    /core\s+competencies?:?\s*[:\-]?\s*([^\n]+(?:\n[^\n]+){0,10})/i,
  ];
  
  skillsSectionPatterns.forEach(pattern => {
    const match = resumeText.match(pattern);
    if (match) {
      const skillsText = match[1];
      // Extract comma, semicolon, or bullet-separated skills
      const extracted = skillsText
        .split(/[,;•\-\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 50);
      extracted.forEach(skill => skills.add(skill.toLowerCase()));
    }
  });
  
  return Array.from(skills).map(s => s.charAt(0).toUpperCase() + s.slice(1));
}

// Extract work experience
export function extractExperience(resumeText: string): {
  years: number;
  positions: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
} {
  const positions: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }> = [];
  
  let totalYears = 0;
  
  // Common experience section patterns
  const experiencePatterns = [
    /(?:experience|work\s+experience|employment|professional\s+experience):?\s*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|$))/i,
    /(?:employment\s+history|work\s+history):?\s*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|$))/i,
  ];
  
  let experienceSection = '';
  experiencePatterns.forEach(pattern => {
    const match = resumeText.match(pattern);
    if (match && match[1]) {
      experienceSection = match[1];
    }
  });
  
  if (!experienceSection) {
    // Fallback: look for date patterns throughout the document
    experienceSection = resumeText;
  }
  
  // Pattern to match job entries: Title at Company (Date - Date)
  const jobEntryPattern = /([A-Z][^\n]{10,80}?)\s*(?:at|@|,)\s*([A-Z][^\n]{5,60}?)\s*(?:\(|\[|,)\s*([^\n]{5,30}?)\s*(?:\)|\]|,|\n)/g;
  const datePattern = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\w+\s+\d{4}|\d{4})\s*(?:[-–—]|to|until|present|current)\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\w+\s+\d{4}|\d{4}|present|current)/gi;
  
  // Extract years from dates
  const yearMatches = resumeText.match(/\b(19|20)\d{2}\b/g);
  if (yearMatches && yearMatches.length >= 2) {
    const years = yearMatches.map(y => parseInt(y)).sort((a, b) => a - b);
    totalYears = years[years.length - 1] - years[0];
    if (totalYears > 50) totalYears = Math.floor(totalYears / 2); // Sanity check
  }
  
  // Try to extract individual positions
  const lines = experienceSection.split('\n');
  let currentPosition: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if line contains a job title pattern
    const titleMatch = line.match(/^([A-Z][^–—\-•\n]{10,60}?)(?:\s*[-–—]\s*|\s+at\s+|\s+@\s+)/i);
    if (titleMatch) {
      if (currentPosition) {
        positions.push(currentPosition);
      }
      currentPosition = {
        title: titleMatch[1].trim(),
        company: '',
        duration: '',
        description: '',
      };
    }
    
    // Check for company name
    if (currentPosition && !currentPosition.company) {
      const companyMatch = line.match(/(?:at|@|,)\s*([A-Z][^–—\-•\n]{5,60}?)(?:\s*\(|\s*\[|\s*$)/i);
      if (companyMatch) {
        currentPosition.company = companyMatch[1].trim();
      }
    }
    
    // Check for date range
    const dateMatch = line.match(datePattern);
    if (dateMatch && currentPosition) {
      currentPosition.duration = dateMatch[0];
    }
    
    // Collect description (bullets or paragraphs)
    if (currentPosition && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^[A-Z]/.test(line))) {
      if (currentPosition.description) {
        currentPosition.description += ' ' + line.replace(/^[•\-\*]\s*/, '');
      } else {
        currentPosition.description = line.replace(/^[•\-\*]\s*/, '');
      }
    }
  }
  
  if (currentPosition) {
    positions.push(currentPosition);
  }
  
  // If no positions found, estimate years from text
  if (positions.length === 0 && totalYears === 0) {
    const yearKeywords = resumeText.match(/\b(\d+)\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/i);
    if (yearKeywords) {
      totalYears = parseInt(yearKeywords[1]) || 0;
    }
  }
  
  return {
    years: totalYears,
    positions: positions.filter(p => p.title && p.company),
  };
}

// Extract education information
export function extractEducation(resumeText: string): Array<{
  degree: string;
  institution: string;
  field: string;
  year: string;
}> {
  const education: Array<{
    degree: string;
    institution: string;
    field: string;
    year: string;
  }> = [];
  
  // Find education section
  const educationPatterns = [
    /(?:education|academic\s+background|qualifications):?\s*\n([\s\S]*?)(?=\n\s*(?:experience|skills|projects|$))/i,
  ];
  
  let educationSection = '';
  educationPatterns.forEach(pattern => {
    const match = resumeText.match(pattern);
    if (match && match[1]) {
      educationSection = match[1];
    }
  });
  
  if (!educationSection) {
    // Fallback: search entire document
    educationSection = resumeText;
  }
  
  // Pattern to match degree entries
  const degreePattern = /([A-Z][^\n]{5,100}?)(?:\s*[-–—]\s*|\s+at\s+|\s+@\s+|\s*,\s*)([A-Z][^\n]{5,80}?)(?:\s*[-–—]\s*|\s*,\s*|\s*\(|\s*\[|\s*$)/g;
  
  const lines = educationSection.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Check for degree type
    let degree = '';
    let degreeType = '';
    DEGREE_PATTERNS.forEach(pattern => {
      if (pattern.test(trimmed)) {
        const match = trimmed.match(pattern);
        if (match) {
          degreeType = match[1];
        }
      }
    });
    
    if (degreeType) {
      // Extract full degree line
      const parts = trimmed.split(/[-–—,]/).map(p => p.trim());
      degree = parts[0] || degreeType;
      const institution = parts[1] || parts[0] || '';
      const field = parts[2] || '';
      const yearMatch = trimmed.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? yearMatch[0] : '';
      
      if (degree || institution) {
        education.push({
          degree: degree || degreeType,
          institution: institution,
          field: field,
          year: year,
        });
      }
    }
  }
  
  return education;
}

// Main parser function
export function parseResume(resumeText: string): ParsedResume {
  const skills = extractSkills(resumeText);
  const experience = extractExperience(resumeText);
  const education = extractEducation(resumeText);
  
  return {
    skills,
    experience,
    education,
  };
}






