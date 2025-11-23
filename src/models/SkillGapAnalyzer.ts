class SkillGapAnalyzer {
  private skillTaxonomy: Record<string, string[]>;
  private semanticRelations: Record<string, string[]>;

  constructor() {
    this.skillTaxonomy = this.initSkillTaxonomy();
    this.semanticRelations = this.initSemanticRelations();
  }

  private initSkillTaxonomy() {
    return {
      programming: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'C#', 'Scala'],
      frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Rails', 'Laravel', 'Next.js', 'Nest.js'],
      databases: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'Cassandra', 'DynamoDB', 'SQLite', 'MariaDB'],
      cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD', 'Ansible', 'CloudFormation'],
      data: ['Machine Learning', 'Data Analysis', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Tableau', 'Power BI', 'Scikit-learn', 'Apache Spark'],
      web: ['HTML', 'CSS', 'REST API', 'GraphQL', 'WebSockets', 'Responsive Design', 'Web Performance', 'SEO'],
      tools: ['Git', 'GitHub', 'GitLab', 'JIRA', 'Confluence', 'VS Code', 'IntelliJ', 'Postman', 'Figma'],
      methodologies: ['Agile', 'Scrum', 'Kanban', 'DevOps', 'TDD', 'BDD', 'Microservices', 'REST', 'SOLID'],
      soft: ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Collaboration'],
    };
  }

  private initSemanticRelations() {
    return {
      JavaScript: ['JS', 'ECMAScript', 'React', 'Vue', 'Angular', 'Node.js', 'TypeScript'],
      TypeScript: ['TS', 'JavaScript', 'React', 'Angular', 'Node.js'],
      React: ['React.js', 'ReactJS', 'JavaScript', 'JSX', 'Next.js', 'Redux'],
      Python: ['Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Machine Learning'],
      AWS: ['Amazon Web Services', 'EC2', 'S3', 'Lambda', 'Cloud', 'CloudFormation'],
      Docker: ['Containerization', 'Kubernetes', 'DevOps', 'Container'],
      SQL: ['MySQL', 'PostgreSQL', 'Database', 'Relational Database', 'RDBMS'],
      'Machine Learning': ['ML', 'AI', 'TensorFlow', 'PyTorch', 'Data Science', 'Neural Networks'],
      'Node.js': ['NodeJS', 'Express', 'JavaScript', 'Backend', 'Server-side'],
      Kubernetes: ['K8s', 'Container Orchestration', 'Docker', 'DevOps'],
      'CI/CD': ['Continuous Integration', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'DevOps'],
      'REST API': ['RESTful', 'API', 'Web Services', 'HTTP'],
      Agile: ['Scrum', 'Kanban', 'Sprint', 'Project Management'],
      Git: ['Version Control', 'GitHub', 'GitLab', 'Source Control'],
    };
  }

  private tokenize(text: string) {
    const cleaned = text
      .toLowerCase()
      .replace(/[^\w\s+#+\-.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned.split(' ').filter((token) => token.length > 0);
  }

  private removeStopWords(tokens: string[]) {
    const stopWords = new Set([
      'the',
      'a',
      'an',
      'and',
      'or',
      'but',
      'in',
      'on',
      'at',
      'to',
      'for',
      'of',
      'with',
      'by',
      'from',
      'as',
      'is',
      'was',
      'are',
      'were',
      'been',
      'be',
      'have',
      'has',
      'had',
      'do',
      'does',
      'did',
      'will',
      'would',
      'should',
      'could',
      'may',
      'might',
      'must',
      'can',
      'this',
      'that',
      'these',
      'those',
      'i',
      'you',
      'he',
      'she',
      'it',
      'we',
      'they',
    ]);
    return tokens.filter((token) => !stopWords.has(token));
  }

  private extractNGrams(tokens: string[], n: number) {
    const ngrams: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  private extractSkills(text: string) {
    const tokens = this.tokenize(text);
    const skills = new Set<string>();

    for (let n = 1; n <= 4; n++) {
      const ngrams = this.extractNGrams(tokens, n);
      ngrams.forEach((ngram) => {
        Object.values(this.skillTaxonomy)
          .flat()
          .forEach((skill) => {
            if (ngram.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ngram)) {
              skills.add(skill);
            }
          });
      });
    }
    return Array.from(skills);
  }

  private calculateSimilarity(skill1: string, skill2: string) {
    const s1 = skill1.toLowerCase();
    const s2 = skill2.toLowerCase();

    if (s1 === s2) return 1.0;
    if (this.semanticRelations[skill1]?.some((r) => r.toLowerCase() === s2)) return 0.85;
    if (this.semanticRelations[skill2]?.some((r) => r.toLowerCase() === s1)) return 0.85;
    if (s1.includes(s2) || s2.includes(s1)) return 0.75;

    const distance = this.levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    const similarity = 1 - distance / maxLen;
    return similarity > 0.6 ? similarity : 0.0;
  }

  private levenshteinDistance(str1: string, str2: string) {
    const matrix: number[][] = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private expandTJDSkills(tjdSkills: string[]) {
    const expandedSkills = new Map<string, { original: boolean; score: number }>();
    tjdSkills.forEach((skill) => {
      expandedSkills.set(skill, { original: true, score: 1.0 });
      if (this.semanticRelations[skill]) {
        this.semanticRelations[skill].forEach((relatedSkill) => {
          const similarity = this.calculateSimilarity(skill, relatedSkill);
          if (similarity > 0.7 && !expandedSkills.has(relatedSkill)) {
            expandedSkills.set(relatedSkill, { original: false, score: similarity });
          }
        });
      }
    });
    return expandedSkills;
  }

  private categorizeSkillPriority(tjd: string, skill: string) {
    const mustHaveKeywords = ['required', 'must have', 'essential', 'mandatory'];
    const niceToHaveKeywords = ['preferred', 'nice to have', 'plus', 'bonus'];
    const context = tjd.toLowerCase();
    const index = context.indexOf(skill.toLowerCase());

    if (index === -1) return 'Important';
    const skillContext = context.substring(Math.max(0, index - 100), Math.min(context.length, index + 100));

    if (mustHaveKeywords.some((kw) => skillContext.includes(kw))) return 'Must-Have';
    if (niceToHaveKeywords.some((kw) => skillContext.includes(kw))) return 'Nice-to-Have';
    return 'Important';
  }

  private groupByPriority(skills: any[]) {
    return {
      'Must-Have': skills.filter((s) => s.priority === 'Must-Have'),
      Important: skills.filter((s) => s.priority === 'Important'),
      'Nice-to-Have': skills.filter((s) => s.priority === 'Nice-to-Have'),
    };
  }

  private generateDevelopmentActions(skill: string) {
    const actionTemplates = {
      programming: [
        `Complete an online course on ${skill} (Udemy, Coursera, or freeCodeCamp)`,
        `Build 2-3 projects using ${skill} and deploy them to GitHub`,
        `Solve ${skill} coding challenges on LeetCode or HackerRank`,
        `Read official ${skill} documentation and best practices guides`,
      ],
      frameworks: [
        `Take a comprehensive ${skill} bootcamp or tutorial series`,
        `Build a full-stack application using ${skill}`,
        `Contribute to open-source ${skill} projects on GitHub`,
        `Study ${skill} design patterns and architecture`,
      ],
      databases: [
        `Complete a ${skill} certification course`,
        `Practice database design and optimization with ${skill}`,
        `Build a project with ${skill} integration`,
        `Learn ${skill} query optimization and performance tuning`,
      ],
      cloud: [
        `Earn ${skill} certification (Associate or Professional level)`,
        `Deploy sample applications using ${skill} services`,
        `Complete hands-on labs on ${skill} platform`,
        `Study ${skill} architecture and best practices`,
      ],
      soft: [
        `Take a professional development course on ${skill}`,
        `Join a ${skill} workshop or seminar`,
        `Practice ${skill} in team projects or volunteer work`,
        `Read books on ${skill} and implement strategies`,
      ],
    };

    let category = 'programming';
    for (const [cat, skills] of Object.entries(this.skillTaxonomy)) {
      if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
        category = cat;
        break;
      }
    }

    const actions = actionTemplates[category as keyof typeof actionTemplates] || actionTemplates.programming;
    return actions.map((action) => action.replace('${skill}', skill));
  }

  private generateResumeOptimization(skill: string, tjd: string) {
    const templates = [
      `Developed and maintained applications using ${skill}, implementing best practices for performance and scalability`,
      `Led cross-functional team in ${skill} project delivery, resulting in 30% improvement in efficiency`,
      `Architected and deployed ${skill}-based solutions, handling 10,000+ daily active users`,
      `Implemented ${skill} features that improved system performance by 40% and reduced load time`,
      `Collaborated with development team to integrate ${skill} into existing infrastructure`,
      `Optimized ${skill} workflows, reducing processing time by 25% and improving user experience`,
    ];

    const tjdLower = tjd.toLowerCase();
    let selectedTemplate = templates[0];

    if (tjdLower.includes('lead') || tjdLower.includes('senior')) selectedTemplate = templates[1];
    else if (tjdLower.includes('architect') || tjdLower.includes('design')) selectedTemplate = templates[2];
    else if (tjdLower.includes('optimize') || tjdLower.includes('performance')) selectedTemplate = templates[3];

    return selectedTemplate.replace('${skill}', skill);
  }

  private generateRecommendations(skill: string, tjd: string) {
    return {
      skill,
      developmentActions: this.generateDevelopmentActions(skill),
      resumeOptimization: this.generateResumeOptimization(skill, tjd),
    };
  }

  private generateActionPlan(gapAnalysis: any, tjd: string) {
    const actionPlan: any[] = [];

    Object.entries(gapAnalysis.missingSkills).forEach(([priority, skills]) => {
      (skills as any[]).forEach((skillData) => {
        const recommendations = this.generateRecommendations(skillData.skill, tjd);
        actionPlan.push({
          priority,
          type: 'Missing Skill',
          ...recommendations,
        });
      });
    });

    Object.entries(gapAnalysis.weakSkills).forEach(([priority, skills]) => {
      (skills as any[]).forEach((skillData) => {
        const recommendations = this.generateRecommendations(skillData.skill, tjd);
        actionPlan.push({
          priority,
          type: 'Weak Match',
          currentMatch: skillData.matchedWith,
          score: skillData.score,
          ...recommendations,
        });
      });
    });

    return actionPlan;
  }

  private analyzeGaps(tjd: string, crp: string) {
    const tjdSkills = this.extractSkills(tjd);
    const crpSkills = this.extractSkills(crp);
    const expandedTJD = this.expandTJDSkills(tjdSkills);

    const skillScores: any[] = [];

    expandedTJD.forEach((tjdData, tjdSkill) => {
      let maxScore = 0.0;
      let matchedSkill = null;

      crpSkills.forEach((crpSkill) => {
        const similarity = this.calculateSimilarity(tjdSkill, crpSkill);
        if (similarity > maxScore) {
          maxScore = similarity;
          matchedSkill = crpSkill;
        }
      });

      const priority = this.categorizeSkillPriority(tjd, tjdSkill);
      skillScores.push({
        skill: tjdSkill,
        score: maxScore,
        matchedWith: matchedSkill,
        priority,
        isOriginalTJD: tjdData.original,
      });
    });

    const totalWeight = skillScores.reduce((sum, item) => {
      const weight = item.priority === 'Must-Have' ? 3 : item.priority === 'Important' ? 2 : 1;
      return sum + weight;
    }, 0);

    const weightedScore = skillScores.reduce((sum, item) => {
      const weight = item.priority === 'Must-Have' ? 3 : item.priority === 'Important' ? 2 : 1;
      return sum + item.score * weight;
    }, 0);

    const overallFitScore = totalWeight === 0 ? 0 : Math.round((weightedScore / totalWeight) * 100);

    const missingSkills = skillScores.filter((s) => s.score === 0.0 && s.isOriginalTJD);
    const weakSkills = skillScores.filter((s) => s.score > 0.0 && s.score < 0.7 && s.isOriginalTJD);
    const strongSkills = skillScores.filter((s) => s.score >= 0.7);

    return {
      overallFitScore,
      missingSkills: this.groupByPriority(missingSkills),
      weakSkills: this.groupByPriority(weakSkills),
      strongSkills,
      allSkillScores: skillScores,
    };
  }

  private generateSummary(gapAnalysis: any, actionPlan: any[]) {
    const totalMissing = Object.values(gapAnalysis.missingSkills).reduce(
      (sum, arr: any) => sum + (arr as any[]).length,
      0
    );
    const totalWeak = Object.values(gapAnalysis.weakSkills).reduce((sum, arr: any) => sum + (arr as any[]).length, 0);

    return {
      fitScore: gapAnalysis.overallFitScore,
      totalGaps: totalMissing,
      totalWeakMatches: totalWeak,
      priorityActions: actionPlan.filter((a) => a.priority === 'Must-Have').length,
      recommendation:
        gapAnalysis.overallFitScore >= 80
          ? 'Strong Match - Apply with confidence'
          : gapAnalysis.overallFitScore >= 60
          ? 'Good Match - Address key gaps before applying'
          : 'Needs Improvement - Focus on building missing critical skills',
    };
  }

  analyze(tjd: string, crp: string) {
    const gapAnalysis = this.analyzeGaps(tjd, crp);
    const actionPlan = this.generateActionPlan(gapAnalysis, tjd);

    return {
      gapAnalysis: {
        Overall_Fit_Score: gapAnalysis.overallFitScore,
        Missing_Required_Skills: gapAnalysis.missingSkills,
        Weak_Match_Skills: gapAnalysis.weakSkills,
        Strong_Matches: gapAnalysis.strongSkills.length,
        Total_Skills_Analyzed: gapAnalysis.allSkillScores.length,
      },
      actionPlan,
      summary: this.generateSummary(gapAnalysis, actionPlan),
    };
  }
}

export default SkillGapAnalyzer;





