import { useState, useEffect, useRef } from 'react';
import UserForm from './UserForm';
import { RUTE_USER_EDIT, RUTE_USER_DATA } from '../../../utils/Rutes';
import { http } from '../../../utils/http_request';
import { toast } from 'react-toastify';
import { User, Save, Loader2, CheckCircle, Shield, Mail } from 'lucide-react';
import { BACKEND_URL } from '@/utils/GlobalVars';
import { generateWhatsAppLink } from '@/services/generateWhatsAppLink';
import { FaWhatsapp } from 'react-icons/fa';
export default function PersonalInfoFrom() {
  const [newData, setNewData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    socialMedia: {
      twitter: '',
      tiktok: '',
      instagram: '',
      youtube: '',
      telegram: '',
      discord: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profilePreview, setProfilePreview] = useState('');
  const [profileFile, setProfileFile] = useState(null);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const session = JSON.parse(localStorage.getItem('user') || '{}');
        if (!session?.userName) return;
        const res = await http.get(`${RUTE_USER_DATA}/${session.userName}`);
        if (res.status === 200) {
          const data = res.data.data || {};
          setNewData(data);
          setProfilePreview(BACKEND_URL + data.selectedAvatar);
        }
      } catch {
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleDataChange = updated => {
    setNewData(updated);
    setHasChanges(true);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePreview(URL.createObjectURL(file));
    setProfileFile(file);
    setIsRemovingImage(false);
    setHasChanges(true);
  };

  const handleRemoveImage = () => {
    setProfilePreview('');
    setProfileFile(null);
    setIsRemovingImage(true);
    setHasChanges(true);
  };

  const handleContactSupport = () => {
    const message = 'Hi! I need help updating my profile on TradeTab.';
    const whatsappNumber = import.meta.env.VITE_PHONE_SUPPORT || '+447494208836';
    const whatsappLink = generateWhatsAppLink(whatsappNumber, message);
    window.open(whatsappLink, '_blank');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const session = JSON.parse(localStorage.getItem('user') || '{}');
      const email = session?.email;
      const formData = new FormData();

      formData.append('email', email || '');
      formData.append('socialMedia', JSON.stringify(newData.socialMedia || {}));

      Object.entries(newData).forEach(([k, v]) => {
        if (k !== 'socialMedia') formData.append(k, v ?? '');
      });

      if (profileFile) formData.append('selectedAvatar', profileFile);
      if (isRemovingImage) formData.append('removeselectedAvatar', 'true');

      const res = await http.put(RUTE_USER_EDIT, formData);
      const updated = res.data.data || {};
      localStorage.setItem('user', JSON.stringify(updated));
      setProfilePreview(BACKEND_URL + updated.selectedAvatar);
      setProfileFile(null);
      setIsRemovingImage(false);
      toast.success('Profile updated successfully!');
      setHasChanges(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className='flex justify-center items-center min-h-[300px] text-gray-400'>
        <Loader2 className='w-6 h-6 animate-spin mr-2' /> Loading profile...
      </div>
    );

  const completion =
    Math.min(100, Object.values(newData).filter(v => v && v !== '').length * 20) || 0;

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='mb-10'>
        <div className='flex items-center gap-6 mb-6'>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileChange}
          />

          <div>
            <h1 className='text-4xl font-bold text-white mb-2'>Personal Information</h1>
            <p className='text-gray-400 text-lg'>Update your profile and contact details</p>
          </div>
        </div>

        {/* Progress */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm text-gray-400'>
            <span>Profile completion</span>
            <span className='text-teal-400 font-medium'>{completion}%</span>
          </div>
          <div className='w-full bg-gray-700 rounded-full h-2 overflow-hidden'>
            <div
              className='bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-500 ease-out'
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <div className='bg-gradient-to-br from-darkblack-600 to-darkblack-700 rounded-2xl border border-gray-700/50 p-8'>
            <UserForm
              newData={newData}
              setNewData={handleDataChange}
              userData={newData}
              profilePreview={profilePreview}
              onSelectImage={triggerFileSelect}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Save */}
          <div className='bg-darkblack-700 border border-gray-700/50 p-6 rounded-2xl'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg'>
                <Save className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-white'>Save Changes</h3>
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition-all duration-300 ${
                hasChanges && !isSaving
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:scale-[1.02]'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  <span>Saving...</span>
                </>
              ) : hasChanges ? (
                <>
                  <Save className='w-5 h-5' />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <CheckCircle className='w-5 h-5' />
                  <span>All Saved</span>
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className='bg-darkblack-700 border border-gray-700/50 p-6 rounded-2xl'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-blue-600 rounded-lg'>
                <Shield className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-white'>Profile Tips</h3>
            </div>
            <ul className='text-gray-400 text-sm space-y-2 list-disc pl-5'>
              <li>Complete your profile to get better recommendations</li>
              <li>Add social media to connect with other traders</li>
              <li>Keep your information up to date</li>
              <li>Your email is used for account recovery</li>
            </ul>
          </div>

          {/* Support */}
          <div className='bg-darkblack-700 border border-gray-700/50 p-6 rounded-2xl'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-green-600 rounded-lg'>
                <FaWhatsapp className='w-5 h-5 text-white' />
              </div>
              <h3 className='text-lg font-semibold text-white'>Need Help?</h3>
            </div>
            <p className='text-sm text-gray-400 mb-4'>
              Having trouble updating your profile? Contact our support team via WhatsApp.
            </p>
            <button
              onClick={handleContactSupport}
              className='w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-green-500/50'
            >
              <FaWhatsapp className='w-5 h-5' />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
