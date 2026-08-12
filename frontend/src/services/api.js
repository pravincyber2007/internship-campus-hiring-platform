import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Company Auth (Sends Form Data for OAuth2 compatibility like Student)
export const registerCompany = async (data) => {
  return await axios.post(`${API_URL}/companies/register`, data);
};

export const loginCompany = async (credentials) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  return await axios.post(`${API_URL}/companies/login`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

// Student Auth
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

// Internships
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