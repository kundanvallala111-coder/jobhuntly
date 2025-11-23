# JobHuntly AI - Project Presentation Content

## 1. TITLE

**JobHuntly AI: Intelligent Job Matching and Application Tracking System**

---

## 2. INTRODUCTION

### What is JobHuntly AI?

JobHuntly AI is a modern web application that connects job seekers with employers through intelligent resume parsing, automated job matching, and comprehensive application tracking.

### Why JobHuntly AI?

- **For Job Seekers**: AI-powered resume analysis matches candidates with relevant jobs based on skills, experience, and education
- **For Recruiters**: Streamlined hiring process with candidate filtering, application management, and analytics
- **Key Innovation**: Automated resume parsing using Affinda API eliminates manual data entry

---

## 3. EXISTING PROJECT COMPARISON

| Feature | Traditional Job Portals | JobHuntly AI |
|---------|------------------------|--------------|
| Resume Parsing | Manual entry | **AI-powered automatic parsing** |
| Job Matching | Basic keyword search | **Intelligent match percentage algorithm** |
| Application Tracking | Limited status updates | **Real-time tracking with detailed breakdown** |
| Candidate Filtering | Basic search | **Advanced multi-criteria filtering** |
| Resume Analysis | Not available | **Skills, experience, education extraction** |

**Key Differentiator**: JobHuntly AI provides intelligent matching with percentage scores and detailed breakdowns, not just keyword matching.

---

## 4. PROBLEM STATEMENT (NOVELTY)

### Problems Solved:

1. **Manual Resume Data Entry**
   - Traditional: Candidates manually enter skills, experience
   - Solution: AI automatically extracts data from uploaded resume

2. **Inefficient Job Matching**
   - Traditional: Simple keyword matching
   - Solution: Multi-factor algorithm calculates match percentage (skills, experience, education)

3. **Lack of Match Transparency**
   - Traditional: No visibility into why a job matches
   - Solution: Detailed breakdown showing matched/missing skills, experience gaps

4. **Recruiter Workflow Inefficiency**
   - Traditional: Manual candidate screening
   - Solution: Advanced filtering by status, job, skills, and search

### Novelty:
- **AI-Powered Resume Parsing**: Integration with Affinda API for accurate data extraction
- **Intelligent Matching Algorithm**: Multi-dimensional scoring system (skills, experience, education)
- **Transparent Match Analysis**: Shows exactly what matches and what's missing
- **Unified Platform**: Both job seekers and recruiters in one system

---

## 5. METHODOLOGY

### 5.1 Architecture / Workflow of Project

#### System Architecture:
```
┌─────────────┐
│   Frontend  │  React + TypeScript + Tailwind CSS
│  (Client)   │  shadcn/ui Components
└──────┬──────┘
       │
       │ HTTP/REST API
       │
┌──────▼──────┐
│   Backend   │  Supabase (PostgreSQL)
│  (Database) │  Row Level Security (RLS)
└──────┬──────┘
       │
       │ API Integration
       │
┌──────▼──────┐
│  Affinda AI │  Resume Parsing API
│   Service   │
└─────────────┘
```

#### User Workflows:

**Job Seeker Workflow:**
1. Register/Login → 2. Upload Resume → 3. AI Parses Resume → 4. Browse Jobs → 5. View Match Scores → 6. Apply → 7. Track Status

**Recruiter Workflow:**
1. Register/Login → 2. Create Company → 3. Post Jobs → 4. Receive Applications → 5. Filter Candidates → 6. Update Status → 7. View Analytics

#### Key Components:
- **Authentication**: Supabase Auth (Email/Password)
- **Database**: PostgreSQL with 10+ tables (profiles, jobs, applications, etc.)
- **File Processing**: Affinda API for resume parsing
- **Real-time Updates**: Supabase real-time subscriptions

---

### 5.2 Algorithm for Different Modules

#### Module 1: Resume Parsing Algorithm
```
Input: Resume File (PDF/DOCX/TXT)
↓
Affinda API Processing
↓
Extract: Skills, Experience, Education, Personal Info
↓
Map to Standard Format
↓
Output: Structured Resume Data
```

#### Module 2: Job Matching Algorithm
```
For each job:
  1. Skills Match = (Matched Skills / Required Skills) × 100
  2. Experience Match = Calculate based on years required vs. candidate years
  3. Education Match = Check degree/field requirements
  4. Overall Match = Weighted average (Skills: 50%, Experience: 30%, Education: 20%)
  
Return: Sorted list by match percentage (highest first)
```

**Key Features:**
- Fuzzy skill matching (handles variations like "JS" = "JavaScript")
- Experience gap analysis
- Education requirement checking
- Missing skills identification

#### Module 3: Filtering Algorithm
```
Job Filters (Candidates):
  - Multi-criteria filtering (AND logic)
  - Job Type: Checkbox selection
  - Location: Dropdown selection
  - Salary: Range comparison (min ≤ job ≤ max)
  - Skills: Subset matching

Candidate Filters (Recruiters):
  - Text search: Name, email, job title
  - Status: Exact match
  - Job: Exact match
  - Real-time filtering on input change
```

#### Module 4: Application Status Tracking
```
Status Flow:
  Pending → Reviewing → Interview → Accepted/Rejected
  
Each status change:
  - Updates database
  - Creates notification
  - Updates UI in real-time
```

---

### 5.3 Implementation Details

#### Frontend Technologies:
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks (useState, useEffect)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)

#### Backend Technologies:
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for resumes)
- **API**: Supabase REST API
- **Security**: Row Level Security (RLS) policies

#### External Integrations:
- **Affinda API**: Resume parsing service
  - Document upload
  - AI-powered extraction
  - Structured data mapping

#### Key Features Implemented:

1. **Resume Matcher Module**
   - File upload (PDF, DOCX, TXT)
   - Affinda API integration
   - Match percentage calculation
   - Detailed breakdown display

2. **Job Management**
   - Job posting with rich details
   - Multi-criteria filtering
   - Search functionality
   - Application tracking

3. **Candidate Management (Recruiters)**
   - Application filtering
   - Status updates
   - Candidate search
   - Analytics dashboard

4. **User Profiles**
   - Extended candidate profiles
   - Skills, experience, education tracking
   - Portfolio projects
   - Company profiles for recruiters

#### Database Schema:
- **10+ Tables**: profiles, jobs, applications, candidate_profiles, companies, etc.
- **Relationships**: Foreign keys with CASCADE delete
- **Enums**: app_role, application_status
- **Indexes**: Optimized for queries

#### Security Implementation:
- Row Level Security (RLS) on all tables
- Role-based access control (candidate, recruiter, admin)
- User can only access their own data
- Recruiters can only see applications for their jobs

---

## SUMMARY

**JobHuntly AI** is an intelligent job matching platform that:
- ✅ Automates resume parsing using AI
- ✅ Provides intelligent job matching with transparency
- ✅ Streamlines recruitment workflow
- ✅ Offers advanced filtering for both sides
- ✅ Built with modern, scalable technologies

**Impact**: Reduces time-to-hire, improves match quality, and provides data-driven insights for better hiring decisions.



