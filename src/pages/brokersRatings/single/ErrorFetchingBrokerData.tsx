import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../../../utils/http_request';
import { RUTE_SLACK_BROKER_TICKET } from '../../../utils/Rutes';

export default function ErrorFetchingBrokerData({
  brokerName,
  userName,
}: {
  brokerName: any;
  userName: any;
}) {
  const hasSentRequest = useRef(false); // Variable de control para evitar múltiples llamadas
  const navigate = useNavigate(); // Hook para manejar la navegación

  useEffect(() => {
    if (!hasSentRequest.current) {
      hasSentRequest.current = true; // Marcar que la llamada ya se realizó

      http
        .post(RUTE_SLACK_BROKER_TICKET, {
          brokerName,
          userName,
        })
        .catch(error => {
          console.error('Error sending to Slack: ', error);
        });
    }
  }, [brokerName, userName]); // Solo se ejecutará una vez, incluso si el componente se renderiza nuevamente

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Navega a la página anterior si hay un historial previo
    } else {
      navigate('/brokers'); // Redirige a la página de brokers si no hay historial previo
    }
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 10 : 100)); // Incrementa hasta 100%
    }, 200);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] bg-darkblue-900 text-white animate-fadeIn'>
      <h2 className='text-2xl font-semibold mb-4'>Coming Soon</h2>
      <p className='text-xl text-center mb-6'>
        We're gathering server data. Please check back later.
      </p>
      <div className='flex flex-col items-center space-y-6'>
        {/* Barra de progreso animada */}
        <div className='w-96 h-4 bg-gray-700 rounded-full overflow-hidden'>
          <div
            className='h-full bg-teal-500 transition-all duration-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Botón para regresar */}
        <button
          className='mt-4 px-6 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all duration-300'
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
