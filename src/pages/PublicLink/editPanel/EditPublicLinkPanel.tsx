import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSave,
  FaTimes,
  FaUser,
  FaUserTag,
  FaFileAlt,
  FaCalendarAlt,
  FaShareAlt,
  FaImage,
  FaPercentage,
  FaDollarSign,
  FaCheck,
  FaSpinner,
  FaCrown,
  FaPalette,
  FaGlobe,
} from 'react-icons/fa';
import { RUTE_PUBLIC_LINK_EDIT } from '../../../utils/Rutes';
import { toast } from 'react-toastify';
import { useMTAccounts } from '../../../context/accounts/MTAccountsContext';
import { http } from '../../../utils/http_request';
import PersonalSocialMedia from '../PersonalSocialMedia';
import { formatDate } from '../../../services/formatDate';
import EditPublicLinkDateRange from './components/EditPublicLinkDateRange';
import { BACKEND_URL } from '@/utils/GlobalVars';
import Avatar from '@/component/Avatar/Avatar';

const AVATAR_PATH = '/assets/img/avatares';

const EditPublicLinkPanel = ({
  publicAccount,
  user,
  setUser,
  setEditMode,
  account,
  currentUser,
}: any) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(user.userName || '');
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [description, setDescription] = useState(user?.profile?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [socialMedia, setSocialMedia] = useState({
    instagram: user.socialMedia?.instagram || '',
    telegram: user.socialMedia?.telegram || '',
    twitter: user.socialMedia?.twitter || '',
    tiktok: user.socialMedia?.tiktok || '',
    youtube: user.socialMedia?.youtube || '',
    discord: user.socialMedia?.discord || '',
    whatsapp: user.socialMedia?.whatsapp || '',
  });

  const { accounts } = useMTAccounts();
  const [dataMode, setDataMode] = useState(Number(user?.profile?.dataMode) || 0);
  const [startDate, setStartDate] = useState(formatDate(publicAccount?.timeFrame?.startDate));
  const [endDate, setEndDate] = useState(formatDate(publicAccount?.timeFrame?.endDate));
  const [avatars, setAvatars] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(publicAccount?.avatar || '');

  useEffect(() => {
    setUserName(user.userName || '');
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setDescription(user?.profile?.description || '');
    setSocialMedia({
      twitter: user.socialMedia?.twitter || '',
      tiktok: user.socialMedia?.tiktok || '',
      instagram: user.socialMedia?.instagram || '',
      youtube: user.socialMedia?.youtube || '',
      telegram: user.socialMedia?.telegram || '',
      discord: user.socialMedia?.discord || '',
      whatsapp: user.socialMedia?.whatsapp || '',
    });
    setDataMode(user?.profile?.dataMode);
    setSelectedAvatar(user.selectedAvatar || '');
    const loadAvatars = () => {
      const avatarsList = Array.from({ length: 13 }, (_, i) => `${AVATAR_PATH}/${i + 1}.jpg`);
      setAvatars(avatarsList);
    };
    loadAvatars();
  }, [user]);

  const handleDataModeChange = (mode: number) => {
    setDataMode(mode);
  };

  const handleSocialMediaChange = (field: string, value: string) => {
    setSocialMedia({ ...socialMedia, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const response = await http.post(`${RUTE_PUBLIC_LINK_EDIT}`, {
        currentUserName: currentUser?.userName,
        userName,
        firstName,
        lastName,
        description,
        dataMode,
        startDate: startDate || null,
        endDate: endDate || null,
        socialMedia,
        avatar: selectedAvatar,
        accountPublicLink: account,
        accountId: publicAccount._id,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setUser({
          ...user,
          userName,
          firstName,
          lastName,
          profile: {
            ...publicAccount,
            dataMode,
            params: {
              startDate: startDate || null,
              endDate: endDate || null,
            },
            avatar: selectedAvatar,
          },
          socialMedia,
        });

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(response.data.data?.user));

        setEditMode(false);
        navigate(`/${response.data.data.user?.userName}/${account}`);
      } else {
        toast.error('Failed to update public link');
      }
    } catch (error) {
      toast.error('An error occurred while trying to update the public link');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'social', label: 'Social Media', icon: FaShareAlt },
    { id: 'settings', label: 'Settings', icon: FaGlobe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-6'
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex mt-10 justify-between items-center mb-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/30 backdrop-blur-sm'
      >
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'>
            <FaCrown className='h-6 w-6 text-white' />
          </div>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>Edit Public Profile</h1>
            <p className='text-blue-300 text-sm'>Customize your trading profile appearance</p>
          </div>
        </div>

        <div className='flex gap-3'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpdate}
            disabled={isLoading}
            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50'
          >
            {isLoading ? (
              <FaSpinner className='h-4 w-4 animate-spin' />
            ) : (
              <FaSave className='h-4 w-4' />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(false)}
            className='px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200'
          >
            <FaTimes className='h-4 w-4' />
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex gap-2 mb-8 overflow-x-auto'
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className='h-4 w-4' />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Panel - Profile Information */}
        <AnimatePresence mode='wait'>
          {activeTab === 'profile' && (
            <motion.div
              key='profile'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-6'
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm'
              >
                <div className='flex items-center gap-3 mb-6'>
                  <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg'>
                    <FaUser className='h-5 w-5 text-white' />
                  </div>
                  <h2 className='text-xl font-bold text-white'>Profile Information</h2>
                </div>

                <div className='space-y-4'>
                  {/* Username and Account */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Username
                      </label>
                      <input
                        type='text'
                        className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        placeholder='Enter username'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Account
                      </label>
                      <select className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'>
                        {accounts.map((option: any) => (
                          <option key={option.account_number} value={option.account_number}>
                            {option.account_number}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-300 mb-2'>
                        First Name
                      </label>
                      <input
                        type='text'
                        className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder='Enter first name'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Last Name
                      </label>
                      <input
                        type='text'
                        className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder='Enter last name'
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className='block text-sm font-medium text-gray-300 mb-2'>
                      Description
                    </label>
                    <textarea
                      className='w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none'
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder='Tell others about your trading style...'
                    />
                  </div>
                </div>
              </motion.div>

              {/* Data Mode Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm'
              >
                <div className='flex items-center gap-3 mb-6'>
                  <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg'>
                    <FaFileAlt className='h-5 w-5 text-white' />
                  </div>
                  <h2 className='text-xl font-bold text-white'>Display Mode</h2>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDataModeChange(1)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium transition-all duration-200 ${
                      dataMode === 1
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <FaPercentage className='h-5 w-5' />
                    Percentage
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDataModeChange(0)}
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl font-medium transition-all duration-200 ${
                      dataMode === 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <FaDollarSign className='h-5 w-5' />
                    Money
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key='social'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-6'
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm'
              >
                <div className='flex items-center gap-3 mb-6'>
                  <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
                    <FaShareAlt className='h-5 w-5 text-white' />
                  </div>
                  <h2 className='text-xl font-bold text-white'>Social Media Links</h2>
                </div>

                <div className='[&_input]:w-full [&_input]:p-3 [&_input]:bg-gray-800/50 [&_input]:border [&_input]:border-gray-600 [&_input]:text-white [&_input]:rounded-xl [&_input]:mb-4 [&_label]:text-white'>
                  <PersonalSocialMedia
                    newData={socialMedia}
                    handleChange={handleSocialMediaChange}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key='settings'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-6'
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm'
              >
                <div className='flex items-center gap-3 mb-6'>
                  <div className='p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg'>
                    <FaGlobe className='h-5 w-5 text-white' />
                  </div>
                  <h2 className='text-xl font-bold text-white'>Date Range Settings</h2>
                </div>

                <div className='[&_input]:w-full [&_input]:p-3 [&_input]:bg-gray-800/50 [&_input]:border [&_input]:border-gray-600 [&_input]:text-white [&_input]:rounded-xl [&_button]:bg-blue-500 [&_button]:text-white [&_button]:py-3 [&_button]:px-4 [&_button]:rounded-xl [&_label]:text-white'>
                  <EditPublicLinkDateRange
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel - Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm h-fit'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg'>
              <FaUserTag className='h-5 w-5 text-white' />
            </div>
            <h2 className='text-xl font-bold text-white'>Profile Preview</h2>
          </div>

          <div className='bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30'>
            <div className='flex items-center gap-4 mb-4'>
              <Avatar
                src={user.selectedAvatar ? BACKEND_URL + user.selectedAvatar : null}
                name={firstName && lastName ? `${firstName} ${lastName}` : userName}
                size="lg"
                className="border-2 border-blue-500"
              />
              <div>
                <h3 className='text-lg font-bold text-white'>
                  {firstName && lastName ? `${firstName} ${lastName}` : userName}
                </h3>
                <p className='text-blue-300 text-sm'>@{userName}</p>
              </div>
            </div>

            {description && <p className='text-gray-300 text-sm mb-4'>{description}</p>}

            <div className='flex gap-2 flex-wrap'>
              {Object.entries(socialMedia).map(
                ([platform, url]) =>
                  url && (
                    <span
                      key={platform}
                      className='px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded'
                    >
                      {platform}
                    </span>
                  )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditPublicLinkPanel;
