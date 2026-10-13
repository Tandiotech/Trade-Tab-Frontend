import { http } from '@/utils/http_request';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Check, Loader2 } from 'lucide-react';

interface WhichBrokerIsProps {
  brokerName: string;
  setBrokerName: (name: string) => void;
}

export default function WhichBrokerIs({ setBrokerName, brokerName }: WhichBrokerIsProps) {
  const [brokersList, setBrokersList] = useState<any[]>([]);
  const [selected, setSelected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (brokerName.trim() !== '' && !selected) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await http.get(`/brokers/search?name=${encodeURIComponent(brokerName)}`);
          setBrokersList(response.data || []);
        } catch (error) {
          console.error('Error searching brokers:', error);
          setBrokersList([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setBrokersList([]);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [brokerName, selected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrokerSelection = (name: string) => {
    setBrokerName(name);
    setBrokersList([]);
    setSelected(true);
    setIsFocused(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrokerName(e.target.value);
    setSelected(false);
  };

  const showResults = brokersList.length > 0 && !selected && isFocused && brokerName.trim() !== '';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="space-y-2">
        <label htmlFor="brokerName" className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Building2 className="w-4 h-4 text-tradetab-lime" />
          Which business would you like to share information about?
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            id="brokerName"
            value={brokerName}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            className={`w-full pl-12 pr-4 py-3 bg-darkblack-500/50 border rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/50 focus:border-tradetab-lime/50 ${
              selected
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-slate-700/50 hover:border-slate-600/50'
            }`}
            placeholder="Search for a broker..."
            autoComplete="off"
          />
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <div className="p-1 rounded-full bg-green-500/20 border border-green-500/50">
                <Check className="w-4 h-4 text-green-400" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full z-50 bg-darkblack-600/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
          >
            {brokersList.map((broker: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleBrokerSelection(broker.generalInformation.brokerName)}
                className="group px-4 py-3 hover:bg-slate-700/50 cursor-pointer transition-colors duration-200 border-b border-slate-700/30 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-700/50 group-hover:bg-tradetab-lime/20 transition-colors">
                    <Building2 className="w-4 h-4 text-slate-400 group-hover:text-tradetab-lime transition-colors" />
                  </div>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                    {broker.generalInformation.brokerName}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
