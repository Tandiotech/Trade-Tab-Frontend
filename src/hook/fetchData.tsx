import { useEffect, useState } from 'react';
import { http } from '../utils/http_request';

export const useFetchData = (endpoint: string, initialParams: any = {}) => {
  // const [data, setData] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState(initialParams);

  // Actualiza los datos cuando los parámetros cambian
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await http.get(`${endpoint}${queryParams}`);
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, params]);

  return { data, loading, setParams }; // Devuelve setParams para actualizar
};
