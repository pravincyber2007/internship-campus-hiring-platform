# Problem Statement

# 1.Title
Internship & Campus Hiring Platform

# 2.Domain
HRTech/Campus Placement

# 3.Who is the user?
* Student: browses internship listings and applies to them
* Company/Recruiter: registers, posts internships, and reviews applicants
* Admin (T&P Head): verifies students, approves companies, and oversees the process

# 4.What problem are we solving?
* Currently, internship opportunities for students are shared informally — through WhatsApp groups, notice boards, or emails to the placement office — with no single place to track them. 
* Companies send spreadsheets of open roles to the T&P office, which then has to manually match and forward them to eligible students. 
* Students have no way to see the real-time status of their applications, and the T&P office has no easy way to verify that applicants are genuine, currently enrolled students, or that companies posting roles are legitimate. 
* This leads to missed deadlines, duplicate effort, and no accountability in the process.

# 5.Proposed Solution
* Students create a verified profile (name, college, CGPA, skills) and browse internship listings
* Students apply to internships and track their application status in real time
* Companies register and can only post internships after Admin approval
* Companies view and shortlist applicants for their own postings
* Admin verifies student authenticity and approves/rejects company registrations
* Email notification sent to students when their application status changes

# 6.Core Entities / Database Tables
* Student
* Company 
* Admin 
* Internship 
* Application

# 7.User Roles & Permissions
* Student: create/edit own profile, apply to internships, view own application status only
* Company: post internships (only once approved), view/shortlist applicants for own postings only
* Admin: verify students, approve/reject companies, view all data across the platform

# 8.Success Criteria
- A verified student should be able to apply to an internship in under 2 minutes
- A company should be able to view all applicants for a posting in a single screen without manual cross-checking
- Admin should be able to approve or reject a company registration in under 1 minute


# 9.Out of Scope
- Not an assessment/skill-testing portal — no coding tests, quizzes, or automated evaluation
- Only tracks applications end-to-end; does not process payments or stipends
- No in-app chat/messaging between students and companies (email notification only)
- No mobile app — web only


# 10.Chosen Track
Python (FastAPI)