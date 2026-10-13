
export default function JobFormTradingExperience() {
  return (
<div className='space-y-6'>
          <h3 className='text-2xl font-bold'>Trading Experience</h3>
          <select
            name='experienceYears'
            required
            className='w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-4 focus:ring-green-500'
          >
            <option value=''>Select experience level</option>
            <option value='Less than 1 year'>Less than 1 year</option>
            <option value='1-3 years'>1-3 years</option>
            <option value='4-6 years'>4-6 years</option>
            <option value='7+ years'>7+ years</option>
          </select>
        </div>
  )
}
