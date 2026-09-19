import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
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