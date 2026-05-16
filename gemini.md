# Teacher Evaluation System — Workflow & Product Specification

## Project Overview
This document defines the complete workflow, architecture, features, and implementation scope for migrating the current Google Apps Script-based Teacher Evaluation System into an Antigravity-powered full-stack web application hosted on Vercel.

The purpose of this document is to serve as:
* Product Requirement Document (PRD)
* System Workflow Reference
* Technical Scope Definition
* Development Guide for Antigravity
* Deployment & Hosting Blueprint

---

## 1. System Goal
Build a scalable web-based Teacher Evaluation Platform that:
* Allows students to evaluate teachers anonymously
* Supports multiple campuses and classes
* Prevents duplicate submissions
* Generates teacher evaluation reports automatically
* Supports PDF export
* Provides dashboards and analytics
* Supports Khmer + English bilingual UI
* Can scale beyond Google Apps Script limitations

**Target Stack:**
* Frontend: Antigravity-generated React app
* Backend/API: Next.js API Routes / Server Actions
* Database: Supabase or PostgreSQL
* Hosting: Vercel
* Authentication: Clerk/Auth.js/Supabase Auth
* PDF Engine: Puppeteer or React PDF
* Storage: Supabase Storage / Cloudinary / Vercel Blob

---

## 2. Current Problems in Google Apps Script
The migration exists because the current GAS solution has these limitations:

### 2.1 Quota Limits
* Daily PDF conversion limits
* Execution timeouts
* Trigger instability
* Slow spreadsheet recalculation

### 2.2 Performance Problems
* Formula race conditions
* Missing percentages during export
* Trigger duplication loops
* Batch processing limitations

### 2.3 Scalability Issues
* Difficult to manage 10+ campuses
* Difficult to handle 100+ classes
* Difficult to export hundreds of reports reliably

### 2.4 UX Limitations
* No proper admin dashboard
* No user authentication
* No analytics dashboard
* Limited responsive UI

---

## 3. High-Level System Architecture

### 3.1 Frontend
**Technologies**
* React
* Next.js App Router
* Tailwind CSS
* ShadCN UI
* Framer Motion

**Responsibilities**
* Student evaluation forms
* Admin dashboard
* Teacher reports
* Analytics visualization
* Class management
* Survey management

### 3.2 Backend
**Technologies**
* Next.js API Routes
* Server Actions
* Prisma ORM

**Responsibilities**
* API endpoints
* Validation
* Authentication
* Data aggregation
* PDF generation
* Export processing

### 3.3 Database
**Recommended**
* Supabase PostgreSQL

**Core Tables**
* campuses
* grades
* classes
* teachers
* students
* evaluations
* questions
* responses
* reports
* survey_sessions
* admins

### 3.4 Hosting
**Hosting Platform**
* Vercel

**Environment Variables**
* DATABASE_URL
* NEXTAUTH_SECRET
* SUPABASE_URL
* SUPABASE_ANON_KEY
* STORAGE_BUCKET

---

## 4. Core User Roles

### 4.1 Student
**Permissions:**
* Access evaluation link
* Submit anonymous evaluation
* Submit comments
* View thank-you page

**Restrictions:**
* Cannot submit twice
* Cannot access reports
* Cannot access admin pages

### 4.2 Campus Admin
**Permissions:**
* Open/close survey
* Manage classes
* Manage teachers
* Generate reports
* View analytics
* Export PDFs

### 4.3 Super Admin
**Permissions:**
* Manage all campuses
* Manage all users
* Global analytics
* System configuration
* Question management

---

## 5. Functional Modules

### 5.1 Authentication Module
**Features**
* Login page
* Role-based access
* Session management
* Password reset
* Secure admin routes

**Recommended Stack**
* Clerk OR Auth.js OR Supabase Auth

### 5.2 Campus Management Module
**Features**
* Create campus
* Edit campus
* Campus code
* Campus filtering
* Campus analytics

**Example Campuses**
* BTB
* BKK
* STD
* SRP

### 5.3 Grade & Class Management
**Features**
* Create grades
* Create classes
* Assign class codes
* Link classes to campuses
* Activate/deactivate classes

**Example Class IDs**
* C_BTB3_G10_A
* C_STD1_G07_B
* C_BKK2_G04_C

### 5.4 Teacher Management
**Features**
* Add teacher
* Teacher ID
* Teacher assignment
* Multi-class assignment
* Teacher profile

**Teacher Fields**
* teacher_id
* full_name
* english_name
* campus_id
* status

### 5.5 Student Evaluation Module
**Student Workflow**
1. Student opens evaluation link
2. System validates survey status
3. Student selects teacher/class
4. Student answers questions
5. Student submits feedback
6. Submission stored in database
7. Thank-you screen shown

**Features**
* Anonymous evaluation
* Bilingual questions
* Mobile responsive
* Validation rules
* Duplicate prevention
* Auto-save draft (optional)

**Question Types**
* **Rating Questions**
  * Scale: Strongly Agree, Agree, Neutral, Disagree, Strongly Disagree
  * OR Numeric scale: 1–5
* **Comment Questions**
  * Positive feedback
  * Improvement suggestions
  * Open-ended comments

### 5.6 Survey Control Module
**Features**
* Open survey
* Close survey
* Schedule survey
* Multi-campus scheduling
* Deadline control

**Logic**
* If survey_status = CLOSED: Submission disabled, Existing links show “Survey Closed” page

### 5.7 Duplicate Submission Prevention
**Options**
* Option A — Device Fingerprinting: Browser fingerprint, Local storage token
* Option B — Student ID Validation: Student ID required, One submission per teacher
* Option C — Secure Tokenized Links: One-time evaluation token
* Recommended: Hybrid approach.

### 5.8 Report Generation Module
**Features**
* Teacher performance summary (per class)
* **Aggregated Teacher Summary (Combined report across ALL assigned classes and campuses)**
* Question percentages
* Overall score
* Comment aggregation
* PDF export
* DOCX export

**Report Components**
* Header
* School logo
* Teacher name
* Teacher ID
* Class ID (or "Multiple Classes" for aggregated reports)
* Overall score

**Question Breakdown**
* For each question: Average score, Percentage, Trend

**Student Feedback**
* Positive comments
* Improvement comments

**PDF Engine**
* Recommended: Puppeteer OR React PDF
* Avoid: Google Docs conversion, Apps Script PDF export

### 5.9 Analytics Dashboard
**Features**
* Campus performance
* Teacher ranking
* Grade analytics
* Response trends
* Submission counts
* Average scores

**Recommended Charts**
* Bar charts
* Heat maps
* Trend lines
* Radar charts
* Leaderboards

### 5.10 Export Module
**Features**
* Export PDF
* Export Excel
* Export CSV
* Batch export
* Zip download

**Batch Export Workflow**
1. Admin selects campus
2. Admin selects classes
3. Queue export jobs
4. Background processing
5. Generate PDFs
6. Store files
7. Notify completion

### 5.11 Notification Module
**Optional Features**
* Email notifications
* Export completed alerts
* Survey open reminders
* Admin warnings

---

## 6. Database Design

**campuses**
* id (uuid)
* name (text)
* code (text)
* created_at (timestamp)

**classes**
* id (uuid)
* class_code (text)
* campus_id (uuid)
* grade (text)
* section (text)

**teachers**
* id (uuid)
* teacher_code (text)
* teacher_name (text)
* campus_id (uuid)

**class_teachers**
* id (uuid)
* class_id (uuid)
* teacher_id (uuid)

**evaluation_questions**
* id (uuid)
* question_en (text)
* question_kh (text)
* order_no (integer)

**evaluations**
* id (uuid)
* class_id (uuid)
* teacher_id (uuid)
* submitted_at (timestamp)
* token (text)

**evaluation_answers**
* id (uuid)
* evaluation_id (uuid)
* question_id (uuid)
* score (integer)

**evaluation_comments**
* id (uuid)
* evaluation_id (uuid)
* comment (text)

---

## 7. Recommended UI Structure

**Public Pages**
* `/`
* `/survey/[class]`
* `/survey/closed`
* `/thank-you`

**Admin Pages**
* `/admin`
* `/admin/campuses`
* `/admin/classes`
* `/admin/teachers`
* `/admin/reports`
* `/admin/analytics`
* `/admin/settings`

---

## 8. Recommended Folder Structure

    /app
      /(public)
      /(admin)
    /components
    /lib
    /services
    /hooks
    /utils
    /types
    /prisma
    /public
    /styles

---

## 9. Security Requirements
**Must Have**
* HTTPS only
* Role-based auth
* API validation
* Rate limiting
* Secure environment variables
* SQL injection prevention

---

## 10. Performance Requirements
**Goals**
* Fast mobile loading
* Efficient PDF generation
* Background processing
* Queue-safe exports

**Recommended Techniques**
* Incremental rendering
* Background queues
* Debouncing
* API caching
* Edge middleware

---

## 11. Future Expansion Possibilities
**Phase 2 Ideas**
* AI feedback summarization
* Teacher comparison analytics
* Parent dashboards
* Student satisfaction trends
* Semester comparisons
* Multi-language support
* QR-code evaluation access
* Mobile app version

---

## 12. Suggested Development Phases
**Phase 1 — Core Foundation**
* Authentication, Database, Campus management, Class management, Teacher management

**Phase 2 — Evaluation Engine**
* Survey pages, Submission APIs, Validation, Duplicate prevention

**Phase 3 — Reporting**
* Analytics, Teacher reports, PDF generation, Batch exports

**Phase 4 — Optimization**
* Queue processing, Performance tuning, UX improvements, AI features

---

## 13. Simplified Antigravity Prompting Strategy

*To ensure the AI generates the application accurately without timing out or losing context, use these 4 sequential prompts instead of building it all at once:*

**Prompt 1: Foundation & Architecture**
* Initialize the Next.js app with Tailwind and ShadCN.
* Generate the database schema (Prisma/Supabase).
* Implement the Authentication system (Clerk/Auth.js) and protect the `/admin` routes.

**Prompt 2: Admin Management Hub**
* Build the admin dashboard UI.
* Create the CRUD interfaces and Server Actions for Campuses, Classes, Teachers, and Questions.

**Prompt 3: The Evaluation Engine**
* Build the public-facing survey pages (`/survey/[class]`).
* Implement the submission logic, bilingual question rendering, and the duplicate prevention system.

**Prompt 4: Analytics & Reporting**
* Build the Analytics dashboard using charting libraries.
* Implement the Report Generation engine (including both single-class reports and Aggregated Teacher Summary Reports).
* Add the PDF batch export functionality.

---

## 14. Vercel Deployment Workflow
**Steps**
1. Push project to GitHub
2. Connect GitHub to Vercel
3. Configure environment variables
4. Deploy production build
5. Configure custom domain
6. Enable analytics and monitoring

---

## 15. Recommended Third-Party Services
* **Authentication:** Clerk, Auth.js, Supabase Auth
* **Database:** Supabase, Neon PostgreSQL
* **File Storage:** Supabase Storage, Cloudinary, Vercel Blob
* **Analytics:** PostHog, Vercel Analytics
* **Monitoring:** Sentry, LogRocket

---

## 16. Final Recommended Architecture
**Best Production Stack**
* Frontend: Next.js, Tailwind, ShadCN
* Backend: Next.js Server Actions, Prisma
* Database: Supabase PostgreSQL
* Hosting: Vercel
* PDF: Puppeteer
* Auth: Clerk
* Storage: Supabase Storage
* Monitoring: Sentry

---

## 17. Migration Strategy From Google Apps Script
**Existing Assets to Migrate**
* Teachers, Classes, Campuses, Evaluation questions, Existing reports, Historical evaluations

**Migration Steps**
1. Export spreadsheets to CSV
2. Import into PostgreSQL
3. Normalize relationships
4. Verify mappings
5. Test survey submissions
6. Test report generation
7. Test exports
8. Launch pilot campus
9. Full deployment

---

## 18. Success Criteria
The migration is successful when:
* No Apps Script dependency remains
* No PDF quota issues occur
* Reports generate reliably
* No duplicate exports occur
* Multi-campus management is stable
* Admin dashboard is production-ready
* Survey links remain stable
* Analytics load quickly

---

## 19. Final Notes
This migration is intended to transform the current spreadsheet automation workflow into a scalable SaaS-like educational evaluation platform.

The Antigravity + Vercel architecture should prioritize:
* Stability, Scalability, Reliability, Maintainability, Fast report generation, Multi-campus management, Strong UX/UI

The new architecture must avoid all Google Apps Script limitations, especially:
* Execution timeouts
* Trigger instability
* Spreadsheet recalculation race conditions
* Daily PDF conversion quotas
* Duplicate generation issues

---
END OF DOCUMENT