import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  AlertCircle,
  Send,
  CheckCircle2,
  MessageCircle,
  Phone,
  Loader2,
} from 'lucide-react';
import WhichBrokerIs from './WhichBrokerIs';
import { toast } from 'react-toastify';
import { http } from '../../../utils/http_request';
import getUser from '../../../utils/getUser';
import { generateWhatsAppLink } from '../../../services/generateWhatsAppLink';
import { RUTE_SLACK_BROKER_TICKET } from '@/utils/Rutes';

interface BrokerComplaintFormProps {
  setliveChatMode?: (mode: boolean) => void;
}

const issueTypes = [
  { value: 'Exposure', label: 'Account Exposure Issues', icon: AlertCircle },
  { value: 'Unable to Withdraw', label: 'Withdrawal Difficulties', icon: FileText },
  { value: 'Severe Slippage', label: 'Execution Quality Concerns', icon: AlertCircle },
  { value: 'Scam', label: 'Suspicious Activity', icon: AlertCircle },
  { value: 'Others', label: 'Other Concerns', icon: FileText },
];

export default function BrokerComplaintForm({ setliveChatMode }: BrokerComplaintFormProps) {
  const [issueType, setIssueType] = useState('');
  const [brokerName, setBrokerName] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brokerName.trim() || !issueType || !title.trim() || !details.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const report = {
      userName: getUser.userName,
      complaintType: issueType,
      brokerName,
      title,
      message: details,
      date: new Date().toISOString(),
    };

    try {
      const response = await http.post(RUTE_SLACK_BROKER_TICKET, report);

      if (response.data.status === false) throw new Error('Could not submit report');

      toast.success('Your report has been submitted successfully');
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast.error(error.response?.data?.message || 'Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    window.open(
      generateWhatsAppLink('+447494208836', `Broker: ${brokerName}\n${title}\n${details}`),
      '_blank'
    );
  };

  const canSubmit = brokerName.trim() && issueType && title.trim() && details.trim();

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-darkblack-600/80 via-darkblack-700/80 to-darkblack-600/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-6 sm:p-8"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-tradetab-lime/5 via-transparent to-blue-500/5 opacity-50" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative z-10 space-y-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-tradetab-lime/20 to-green-500/20 border border-tradetab-lime/30">
                  <FileText className="w-6 h-6 text-tradetab-lime" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                    Share Your Experience
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Help us understand your experience with this broker
                  </p>
                </div>
              </div>

              {/* Broker Search */}
              <div>
                <WhichBrokerIs brokerName={brokerName} setBrokerName={setBrokerName} />
              </div>

              {/* Issue Type */}
              <div className="space-y-2">
                <label htmlFor="issueType" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  Type of Issue
                </label>
                <select
                  id="issueType"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-darkblack-500/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/50 focus:border-tradetab-lime/50 hover:border-slate-600/50 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-darkblack-600">
                    Select an issue type
                  </option>
                  {issueTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-darkblack-600">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-darkblack-500/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/50 focus:border-tradetab-lime/50 hover:border-slate-600/50"
                  placeholder="Brief summary of your experience"
                  maxLength={100}
                />
              </div>

              {/* Details */}
              <div className="space-y-2">
                <label htmlFor="details" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <MessageCircle className="w-4 h-4 text-purple-400" />
                  Details
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-darkblack-500/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tradetab-lime/50 focus:border-tradetab-lime/50 hover:border-slate-600/50 resize-none"
                  rows={6}
                  placeholder="Please provide as much detail as possible about your experience..."
                  maxLength={1000}
                />
                <p className="text-xs text-slate-500 text-right">
                  {details.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  canSubmit
                    ? 'bg-gradient-to-r from-tradetab-lime to-green-500 hover:from-tradetab-lime/90 hover:to-green-500/90 shadow-lg shadow-tradetab-lime/20'
                    : 'bg-slate-700/50 cursor-not-allowed opacity-50'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-6 flex justify-center"
              >
                <div className="p-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50">
                  <CheckCircle2 className="w-16 h-16 text-green-400" />
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3"
              >
                Report Submitted Successfully
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 mb-8 max-w-md mx-auto"
              >
                Thank you for sharing your experience. Our team will review your report and may reach out if we need additional information.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {setliveChatMode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setliveChatMode(true)}
                    className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
                  >
                    <div className="relative">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                      <MessageCircle className="relative w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-medium">Chat with Support</span>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWhatsAppClick}
                  className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
                >
                  <div className="relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <Phone className="relative w-5 h-5 text-green-400" />
                  </div>
                  <span className="font-medium">Contact via WhatsApp</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
