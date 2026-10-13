
export default function JobFormAvailability() {
  return (
<div className='space-y-6'>
          <h3 className='text-2xl font-bold'>Availability</h3>
          <div className='flex items-center space-x-4'>
            <label className='flex items-center space-x-2'>
              <input
                type='radio'
                name='availability'
                value='true'
                required
                className='text-green-500 focus:ring-green-500'
              />
              <span>Yes</span>
            </label>
            <label className='flex items-center space-x-2'>
              <input
                type='radio'
                name='availability'
                value='false'
                required
                className='text-red-500 focus:ring-red-500'
              />
              <span>No</span>
            </label>
          </div>
          <input
            name='startDate'
            type='date'
            placeholder='Expected Start Date'
            className='w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-4 focus:ring-green-500'
          />
        </div>
  )
}
