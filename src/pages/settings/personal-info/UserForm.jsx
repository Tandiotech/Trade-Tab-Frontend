import React from 'react';
import { User, Mail, Phone, AtSign, UserCheck, Globe, Camera, Shield, Trash2 } from 'lucide-react';

export default function UserForm({
  userData,
  newData,
  setNewData,
  profilePreview,
  onSelectImage,
  onRemoveImage,
}) {
  const handleChange = e => {
    const { name, value } = e.target;
    setNewData({ ...newData, [name]: value });
  };
  const inputFields = [
    { name: 'userName', label: 'Username', icon: AtSign, required: true },
    { name: 'firstName', label: 'First Name', icon: User, required: true },
    { name: 'lastName', label: 'Last Name', icon: User, required: true },
    { name: 'email', label: 'Email', icon: Mail, disabled: true },
    { name: 'phone', label: 'Phone', icon: Phone },
  ];

  return (
    <div className='space-y-12'>
      {/* 🖼 Profile Picture */}
      <div className='text-center'>
        <div className='relative inline-block group mx-auto mb-6'>
          <div
            onClick={onSelectImage}
            className='w-28 h-28 rounded-full border-2 border-gray-700 shadow-lg overflow-hidden bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 relative cursor-pointer'
          >
            {profilePreview ? (
              <img
                src={profilePreview}
                alt='Profile'
                className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80'
              />
            ) : (
              <User className='w-12 h-12 text-white opacity-90' />
            )}

            {/* Overlay */}
            <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]'>
              <Camera className='w-5 h-5 text-white mb-1' />
              <span className='text-xs text-white font-medium tracking-wide'>Change Photo</span>
            </div>

            {/* Border glow */}
            <div className='absolute -inset-[2px] rounded-full border-2 border-teal-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>

          {/* Botones flotantes */}
          <div className='absolute -bottom-2 right-0 flex gap-2'>
            <button
              type='button'
              onClick={onSelectImage}
              className='p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors border border-gray-600'
              title='Change photo'
            >
              <Camera className='w-4 h-4 text-white' />
            </button>
            {profilePreview && (
              <button
                type='button'
                onClick={e => {
                  e.stopPropagation();
                  onRemoveImage();
                }}
                className='p-2 rounded-full bg-gray-800/80 hover:bg-red-600 transition-colors border border-gray-600'
                title='Remove photo'
              >
                <Trash2 className='w-4 h-4 text-white' />
              </button>
            )}
          </div>
        </div>

        <h3 className='text-lg font-medium text-white'>Profile Picture</h3>
        <p className='text-sm text-gray-400 mt-1'>Click or tap the image to change your photo</p>
      </div>

      {/* 👤 Personal Information */}
      <section>
        <div className='flex items-center gap-3 mb-8'>
          <div className='p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg'>
            <UserCheck className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-2xl font-semibold text-white'>Personal Information</h2>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {inputFields.map(({ name, label, icon: Icon, disabled, required }) => (
            <div key={name} className='space-y-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-300'>
                <Icon className='w-4 h-4' />
                {label}
                {required && <span className='text-red-400'>*</span>}
              </label>
              <div className='relative'>
                <input
                  type={name === 'email' ? 'email' : 'text'}
                  name={name}
                  value={newData?.[name] || userData?.[name] || ''}
                  onChange={handleChange}
                  disabled={disabled}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className={`w-full px-6 py-4 bg-darkblack-500 border border-gray-600 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-base ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'
                  }`}
                />
                {disabled && (
                  <div className='absolute inset-y-0 right-0 flex items-center pr-4'>
                    <span className='text-xs text-gray-500 bg-gray-700 px-3 py-1 rounded-lg'>
                      Read-only
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🌐 Social Media */}
      <section>
        <div className='flex items-center gap-3 mb-8'>
          <div className='p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg'>
            <Globe className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-2xl font-semibold text-white'>Social Media (Optional)</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Object.entries(newData.socialMedia || {}).map(([platform, value]) => (
            <div key={platform} className='space-y-3'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-300 capitalize'>
                <div className='w-4 h-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded'></div>
                {platform}
              </label>
              <input
                type='text'
                name={`socialMedia.${platform}`}
                value={value || ''}
                onChange={e =>
                  setNewData({
                    ...newData,
                    socialMedia: {
                      ...newData.socialMedia,
                      [platform]: e.target.value,
                    },
                  })
                }
                placeholder={`Your ${platform} username`}
                className='w-full px-6 py-4 bg-darkblack-500 border border-gray-600 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none hover:border-gray-500 text-base'
              />
            </div>
          ))}
        </div>
      </section>

      {/* 🔒 Security Note */}
      <section className='bg-gradient-to-br from-darkblack-500 to-darkblack-600 rounded-xl p-6 border border-gray-700/50'>
        <div className='flex items-start gap-3'>
          <div className='p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mt-1'>
            <Shield className='w-5 h-5 text-white' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white mb-2'>Security & Privacy</h3>
            <p className='text-sm text-gray-400 leading-relaxed'>
              Your personal information is securely stored and encrypted. We never share your data
              with third parties. Your email is used only for account recovery and important
              notifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
