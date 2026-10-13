import { useState } from 'react';
import GlobalModal from '../../../component/modal/GlobalModal';
import { http } from '../../../utils/http_request';
import { RUTE_SLACK_CONTACT_US } from '../../../utils/Rutes';
import { BiEnvelope } from 'react-icons/bi';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Mensaje para el modal
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalMessage('');

    try {
      const response = await http.post(RUTE_SLACK_CONTACT_US, formData);
      if (response.status === 200) {
        setModalMessage('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setModalMessage('Failed to send message. Please try again later.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
  };

  return (
    <div className='bg-black px-4'>
      <div className='px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20'>
        <div className='grid gap-10 lg:grid-cols-2'>
          <div className='flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg'>
            <div className='flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-teal-accent-400'>
              <BiEnvelope className='text-white w-12 h-12 bg-teal-600 p-2 rounded-full' />
            </div>
            <div className='max-w-xl mb-6'>
              <h2 className='max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-50 sm:text-4xl sm:leading-none'>
                Contact Us
              </h2>
              <p className='text-base text-gray-400 md:text-lg'>
                We're here to help! Whether you’re looking for more information about our services
                or have a specific inquiry, feel free to reach out. Our team is ready to assist you
                with expert guidance and prompt support. Fill out the form below, and we’ll get back
                to you as soon as possible. Let's connect and bring your ideas to life!
              </p>
            </div>
          </div>

          <div className='flex items-center justify-center -mx-4 lg:pl-8'>
            <div className='max-w-lg mx-auto p-6 bg-slate-950 dark:bg-gray-900 border border-teal-700 rounded-2xl shadow-lg'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <input
                  type='text'
                  placeholder='Name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-teal-300 bg-slate-900 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none  text-gray-900 '
                />
                <input
                  type='email'
                  placeholder='Email Address'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-teal-300 bg-slate-900  rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none  text-gray-900 dark:text-white'
                />
                <textarea
                  name='message'
                  placeholder='Message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 border border-teal-300  bg-slate-900 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none   text-gray-900 dark:text-white h-32 resize-none'
                ></textarea>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-gray-400'
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Global para mostrar el mensaje */}
      <GlobalModal
        isActive={showModal}
        onClose={() => setShowModal(false)} // Cerrar el modal
        height='200px'
      >
        <p className='text-green-500 text-center'>{modalMessage}</p>
      </GlobalModal>
    </div>
  );
}
