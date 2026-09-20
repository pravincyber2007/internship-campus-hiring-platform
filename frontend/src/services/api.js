import axios from 'axios';

// Dynamically use Vercel's config variable, with the live Railway backend as a bulletproof fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://internship-campus-hiring-platform-production.up.railway.app';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Single unified registration call handling both user table and profiles
export const registerUser = (userData) => API.post('/auth/register', userData);

export const getStudentProfile = (userId) => API.get(`/students/profile/${userId}`);
export const getInternships = () => API.get('/internships/');
export const postInternship = (internshipData) => API.post('/internships/', internshipData);
export const applyForInternship = (applicationData) => API.post('/applications/', applicationData);
export const getStudentApplications = (studentId) => API.get(`/applications/student/${studentId}`);
export const getCollegeStudents = (collegeCode) => API.get(`/admin/students/${collegeCode}`);

export default API;