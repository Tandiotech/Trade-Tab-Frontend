import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function RedirectTokenPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      toast.error('No auth code found in URL.');
      setLoading(false);
      return;
    }

    const exchangeToken = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_CTRADER_API_URL}/api/oauth/exchange`, null, {
          params: { code },
        });

        const { status, body, message } = response.data;

        if (status === 'success') {
          localStorage.setItem('ctrader_token', JSON.stringify(body));
          toast.success(message || 'Token received and stored.');
        } else {
          toast.error('Failed to exchange token.');
        }
      } catch (error) {
        console.error('❌ Error exchanging token:', error);
        toast.error(error.response?.data?.message || 'Unexpected error.');
      } finally {
        setLoading(false);
      }
    };

    exchangeToken();
  }, [searchParams]);

  return (
    <div className='p-8 text-center'>
      {loading ? <p>Intercambiando token, espera un momento...</p> : <p>Redirección completada.</p>}
    </div>
  );
}
