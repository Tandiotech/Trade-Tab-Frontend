import { http } from '@/utils/http_request';
import { RUTE_GET_BROKER_BY_NAME } from '@/utils/Rutes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IBrokerServer } from '../interfaces';

export default function useBrokerServerSelector(
  setSearchTerm: (term: string) => void,
  searchTerm: string,
  mt_version: number,
  setSelectedServer: (server: string) => void
) {
  const [showList, setShowList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [brokersServers, setBrokersServers] = useState<IBrokerServer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);

  // ⏳ Debounced search
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 1) {
      setBrokersServers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const response = await http.post(RUTE_GET_BROKER_BY_NAME, {
          name: searchTerm,
          mt_version,
        });

        // Backend ahora solo devuelve array
        const data = response.data.brokersServers || [];
        setBrokersServers(data);
      } catch (err) {
        setError('Not Found');
        setBrokersServers([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm, mt_version]);

  const filteredBrokers = useMemo(() => {
    return brokersServers
      .filter(broker => broker?.name?.toLowerCase().includes(searchTerm?.toLowerCase()))
      .sort((a, b) => a.name?.localeCompare(b.name));
  }, [searchTerm, brokersServers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowList(true);
    setSelectedServer(''); // Limpiar selección si vuelve a escribir
  };

  const handleOptionClick = (brokerName: string) => {
    setSearchTerm(brokerName);
    setSelectedServer(brokerName);
    setShowList(false);
  };

  // 🔹 Cerrar lista al click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowList(false);
        setIsModalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    showList,
    isModalOpen,
    brokersServers,
    loading,
    error,
    inputRef,
    filteredBrokers,
    handleInputChange,
    handleOptionClick,
    setIsModalOpen,
    setShowList,
  };
}
