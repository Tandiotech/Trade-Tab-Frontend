import { useState } from 'react';

// Definir la interfaz para AuthUser
interface AuthUserInterface {
  setToken: (user: any, token: string) => void;
  getToken: () => string | null;
  isLoggedIn: () => boolean;
  logout: () => void;
}

export default function useAuthUser(): AuthUserInterface {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('token'); // Inicializar el estado con el token almacenado
  });

  // Crear una instancia de axios

  // Guardar token y usuario en el almacenamiento (localStorage)
  const setToken = (user: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    setTokenState(token);
  };

  // Obtener el token del almacenamiento
  const getToken = () => {
    const storedToken = localStorage.getItem('token');
    return storedToken;
  };

  // Verificar si el usuario está loggeado
  const isLoggedIn = () => {
    return getToken() !== null;
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accountsData');
    setTokenState(null);
  };

  // Retornamos todas las funciones y la instancia de Axios, con la tipificación completa
  return {
    setToken,
    getToken,
    isLoggedIn,
    logout,
    // http, // Para solicitudes adicionales
  };
}
