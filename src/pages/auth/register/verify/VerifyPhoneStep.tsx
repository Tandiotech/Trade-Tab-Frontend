import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { http } from '@/utils/http_request';
import { RUTE_VERIFY_PHONE } from '@/utils/Rutes';

interface VerifyPhoneStepProps {
  watch: any;
  setValue: any;
  onNext: () => void;
  onBack: () => void;
}

const VerifyPhoneStep = ({ watch, onNext, setValue, onBack }: VerifyPhoneStepProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const phone = watch('phone');

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await http.post(RUTE_VERIFY_PHONE, { cellphone:phone, code });
      if (res.data?.status === 200) {
        setValue('phoneVerificationToken', res.data.phoneVerificationToken);

        setSuccess(true);
        setTimeout(() => onNext(), 1000);
      } else {
        setError('Invalid code, please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4 text-center'>
      <h2 className='text-xl font-bold text-white mb-2'>Verify Your Phone</h2>
      <p className='text-slate-300 text-sm mb-4'>Enter the code we sent to your WhatsApp number</p>

      <input
        type='text'
        maxLength={6}
        value={code}
        onChange={e => setCode(e.target.value)}
        className='w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-lg text-center text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg tracking-widest focus:bg-white/30'
        placeholder='Enter code'
      />

      {error && (
        <div className='text-red-400 flex items-center justify-center gap-2 text-sm'>
          <FaTimesCircle /> {error}
        </div>
      )}
      {success && (
        <div className='text-green-400 flex items-center justify-center gap-2 text-sm'>
          <FaCheckCircle /> Verified successfully!
        </div>
      )}

      <div className='flex flex-col sm:flex-row gap-3 mt-4'>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={onBack}
          className='w-full sm:flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all text-sm shadow-lg'
        >
          Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={handleVerify}
          disabled={loading || code.length < 6}
          className={`w-full sm:flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm ${
            loading
              ? 'bg-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </motion.button>
      </div>
    </div>
  );
};

export default VerifyPhoneStep;
