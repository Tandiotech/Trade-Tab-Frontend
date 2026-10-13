export default function JobFormPersonalInformation() {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <input
          name='firstName'
          placeholder='First Name'
          required
          className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
        />
        <input
          name='lastName'
          placeholder='Last Name'
          required
          className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
        />
        <input
          name='email'
          placeholder='Email Address'
          required
          className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
        />
        <input
          name='phoneNumber'
          placeholder='Phone Number'
          required
          className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
        />
        <input
          name='location'
          placeholder='Current Location (City & Country)'
          required
          className='w-full p-4 rounded-lg bg-[#0a1123] border border-slate-800 text-white focus:ring-2 focus:ring-green-700'
        />
      </div>
    </div>
  );
}
