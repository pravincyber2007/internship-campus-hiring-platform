# Problem Statement
 
## 1. Title

Internship & Campus Hiring Platform
 
## 2. Domain

HRTech/Campus Placement
 
## 3. Who is the user?
 
- **Student**: Browses internship listings, applies to them, and tracks application status.
- **Company/Recruiter**: Registers, posts internships, and reviews applicants.
- **Admin (College T&P)**: Oversees and tracks student progress and application statuses using the institutional college code.

## 4. What problem are we solving?
 
- Currently, internship opportunities for students are shared informally — through WhatsApp groups, notice boards, or emails to the placement office — with no single place to track them.
- Companies send spreadsheets of open roles to the placement office, which then has to manually match and forward them to students.
- Students have no way to see the real-time status of their applications, and the college has no centralized institutional dashboard to monitor student engagement and placement tracking.
- This leads to missed deadlines, duplicate effort, and poor visibility into application outcomes.

## 5. Proposed Solution
 
- Students create a profile (name, college code, CGPA, skills) and browse active internship listings.
- Students apply to internships and track their application status in real time.
- Companies register and directly post internship opportunities.
- Companies view and review applicants for their own postings.
- Admin uses the institutional college code to filter and track student engagement and application progress across the campus.

## 6. Core Entities / Database Tables
 
- Student (`student_profiles`)
- Company (`company_profiles`)
- Admin (`admin_profiles`)
- Internship (`internships`)
- Application (`applications`)

## 7. User Roles & Permissions
 
- **Student**: Create/edit own profile, apply to internships, and view own application history.
- **Company**: Post internships and view/manage applicants for their own posted roles.
- **Admin**: Monitor and track student records and application progress mapped to the matching college code.

## 8. Success Criteria
 
- A student should be able to apply to an internship seamlessly.
- A company should be able to view all applicants for a posting in a single screen without manual cross-checking.
- Admin should be able to track student participation and application metrics using the institutional college code.

## 9. Out of Scope
 
- Not an assessment/skill-testing portal — no coding tests, quizzes, or automated evaluations.
- Only tracks applications end-to-end; does not process payments or stipends.
- No in-app chat/messaging between students and companies.
- No mobile app — web-only platform (React & FastAPI).

## 10. Chosen Track
Python (FastAPI) + React + PostgreSQL