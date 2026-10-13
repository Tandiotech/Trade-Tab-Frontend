import { useState } from 'react';
import { Share2 } from 'react-feather';

export default function BrokerHeaderNetworkInteractions({
  brokerName,
}: any) {
  const [copyMessage, setCopyMessage] = useState('');

  // URL base y link público del broker
  const baseUrl = window.location.origin;
  const publicBrokerUrl = `${baseUrl}/broker/${brokerName}`;

  // Función para copiar el link al portapapeles
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(publicBrokerUrl)
      .then(() => {
        setCopyMessage('Link copied to clipboard!');
        setTimeout(() => setCopyMessage(''), 3000); // Limpiar mensaje después de 3 segundos
      })
      .catch(() => {
        setCopyMessage('Failed to copy link. Please try again.');
      });
  };

  return (
    <div className='flex gap-3 items-center text-white self-end absolute top-2 right-2'>
      {/* {isAdmin ? (
        <BiEdit
          onClick={() => setEditMode(!editMode)}
          className={`text-2xl hover:text-green-200 ${editMode ? 'text-green-500' : 'text-white'} cursor-pointer`}
        />
      ) : (
        ''
      )} */}

      {/* Mostrar mensaje de confirmación */}
      {copyMessage ? (
        <p className='text-sm text-green-400 ml-3  whitespace-nowrap '>{copyMessage}</p>
      ) : (
        <button onClick={handleCopyLink}>
          <Share2 className='cursor-pointer hover:text-blue-300 duration-300 mt-1' />
        </button>
      )}
    </div>
  );
}
