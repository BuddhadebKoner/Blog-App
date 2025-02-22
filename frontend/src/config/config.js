import axios from 'axios';

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_SERVER_HOST,
   withCredentials: true,
   headers: {
      'Content-Type': 'application/json',
   },
});

export default axiosInstance;