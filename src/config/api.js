// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://your-backend-domain.vercel.app'
  : 'http://localhost:5007'; // Backend is running on port 5007

// Function to get the actual API URL (can be extended to detect port)
export const getApiUrl = () => {
  return API_BASE_URL;
};

// API endpoints
export const API_ENDPOINTS = {
  FORM_SUBMISSION: `${API_BASE_URL}/api/form`,
  FORM_STATS: `${API_BASE_URL}/api/form/stats`,
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_ENDPOINTS; 