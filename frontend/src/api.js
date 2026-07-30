import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-resume/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error("API Error (uploadResume):", error);
    throw error;
  }
};

export const searchResumes = async (jobDescription) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/search-resumes/`, { 
      job_description: jobDescription 
    });
    return { data: response.data }; 
  } catch (error) {
    console.error("API Error (searchResumes):", error);
    throw error;
  }
};