import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Company Auth (Expects JSON body based on 400 Bad Request error)
export const registerCompany = async (data) => {
  return await axios.post(`${API_URL}/companies/register`, data);
};

export const loginCompany = async (data) => {
  return await axios.post(`${API_URL}/companies/login`, data);
};

// Student Auth (Expects Form Data)
export const registerStudent = async (data) => {
  return await axios.post(`${API_URL}/students/register`, data);
};

export const loginStudent = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  return await axios.post(`${API_URL}/students/login`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

// Internships (Changed from /internships/ to /internships based on 404 Not Found error)
export const postInternship = async (data, token) => {
  return await axios.post(`${API_URL}/internships/post`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getInternships = async () => {
  const token = localStorage.getItem('token');
  return await axios.get(`${API_URL}/internships/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};