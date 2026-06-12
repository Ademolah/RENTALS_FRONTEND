import axios from 'axios';

// Create a customized Axios instance
export const apiClient = axios.create({
  // Vite uses import.meta.env instead of process.env
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =======================================================================
// REQUEST INTERCEPTOR: The Digital Courier
// =======================================================================
apiClient.interceptors.request.use(
  (config) => {
    // 1. Check local storage for the JWT token
    const token = localStorage.getItem('token');
    
    // 2. If it exists, inject it into the Authorization header silently
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =======================================================================
// RESPONSE INTERCEPTOR: The Global Error Catcher
// =======================================================================
apiClient.interceptors.response.use(
  (response) => {
    // If the backend returns a success status (200, 201), let it pass
    return response;
  },
  (error) => {
    // If the backend says the token is invalid or expired (401)
    if (error.response && error.response.status === 401) {
      // 1. Wipe the dead token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 2. Force the user back to the login screen
      // (We will connect this to our React Router later)
      window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);