// import logo from "../../../public/assets/logolight.png"; // Update the path to your logo image

const TradeTabDownload = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-[#0B162C] text-white px-4'>
      {/* Centered Logo */}
      <div className='mb-6 flex justify-center'>
        <img src='/assets/logolight.png' alt='TradeTab Logo' className='w-64' />
      </div>

      {/* Description */}
      <p className='text-lg text-center max-w-lg text-gray-300'>
        To access the <span className='text-green-400 font-bold'>FREE</span> downloadable material,
        please provide the below details:
      </p>

      {/* Form */}
      <div className='w-full max-w-lg mt-6'>
        <form className='grid grid-cols-3 gap-x-4 gap-y-4 items-center w-full max-w-lg'>
          {/* Name */}
          <label className='text-gray-300 text-lg text-left'>Name:</label>
          <input
            type='text'
            style={{ backgroundColor: '#134371' }} // Temporary inline style
            className='col-span-2 bg-blue-800 text-white px-4 py-3 rounded-full w-full text-lg '
          />

          {/* Email */}
          <label className='text-gray-300 text-lg text-left'>Email:</label>
          <input
            type='email'
            style={{ backgroundColor: '#134371' }} // Temporary inline style
            className='col-span-2 bg-blue-800 text-white px-4 py-3 rounded-full w-full text-lg '
          />

          {/* Contact Number */}
          <label className='text-gray-300 text-lg text-left'>Contact Number:</label>
          <input
            type='text'
            style={{ backgroundColor: '#134371' }} // Temporary inline style
            className='col-span-2 bg-blue-800 text-white px-4 py-3 rounded-full w-full text-lg '
          />

          {/* Submit Button (Centered) */}
          <div className='col-span-3 flex justify-center mt-6'>
            <button className='w-2/3 bg-teal-500 text-white py-4 text-lg rounded-full hover:bg-teal-600 transition'>
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Footer Note */}
      <p className='mt-6 text-sm italic text-gray-400 text-center max-w-lg'>
        If you have already registered with TradeTab, please ensure the details you provide match
        the information you registered with.
      </p>
    </div>
  );
};

export default TradeTabDownload;
