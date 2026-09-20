import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://internship-campus-hiring-platform-production.up.railway.app';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = (userData) => API.post('/api/auth/register', userData);
export const getStudentProfile = (userId) => API.get(`/api/students/profile/${userId}`);
export const getInternships = () => API.get('/api/internships/');
export const postInternship = (internshipData) => API.post('/api/internships/', internshipData);
export const applyForInternship = (applicationData) => API.post('/api/applications/', applicationData);
export const getStudentApplications = (studentId) => API.get(`/api/applications/student/${studentId}`);
export const getCollegeStudents = (collegeCode) => API.get(`/api/admin/students/${collegeCode}`);

export default API;