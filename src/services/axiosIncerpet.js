// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      console.log("Token expired.")
      // Código para manejar el token expirado
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userId');
      // Redirigir al usuario a la página principal
      window.location = '/';

    }
    return Promise.reject(error);
  }
);

export default api;
