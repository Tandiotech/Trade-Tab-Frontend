import { useState } from 'react';

export default function GetMyCase() {
  const [phoneNumber] = useState('447895291517');  // Número sin el código de país
  const [isChecked, setIsChecked] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const messages = [
    { label: "Issue with my account", value: "I'm having an issue with my account." },
    { label: "Withdrawal problems", value: "I'm experiencing problems with withdrawals." },
    { label: "Need assistance with trading", value: "I need assistance with my trading account." },
    { label: "General inquiry", value: "I have a general inquiry about your services." },
    { label: "Report a technical issue", value: "I'm reporting a technical issue with the platform." }
  ];

  const handleCheckboxChange = (e:any) => {
    setIsChecked(e.target.checked);
  };

  const handleMessageChange = (e:any) => {
    setSelectedMessage(e.target.value);
    setCustomMessage('');  // Resetea el mensaje personalizado si se selecciona una opción predefinida
  };

  const handleCustomMessageChange = (e:any) => {
    setCustomMessage(e.target.value);
    setSelectedMessage('');  // Resetea la selección predefinida si se ingresa un mensaje personalizado
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if ((selectedMessage || customMessage) && isChecked) {
      setSubmitted(true);
    } else {
      alert('Please fill out all fields and accept the terms.');
    }
  };

  const generateWhatsAppLink = () => {
    const baseUrl = "https://wa.me/";  // Base URL de WhatsApp
    const message = selectedMessage || customMessage;  // Usa el mensaje seleccionado o personalizado
    const encodedMessage = encodeURIComponent(message);
    return `${baseUrl}${phoneNumber}?text=${encodedMessage}`;
  };

  return (
    <div className="w-full max-h-full rounded-xl col-span-7">
      <div className="rounded-t-xl bg-[#02C686] flex items-center justify-center py-4 text-white shadow-xl">
        <h2 className="font-bold">GET MY CASE</h2>
      </div>
      <div className="space-y-4 py-4 px-4">
        <p className="text-2xl md:text-4xl font-bold text-slate-700 mb-4 md:mb-12 italic mt-14">
          Message us to speed up your application!
        </p>

        <p className="text-white mb-4">
          TradeTab will leverage its extensive network and resources to establish direct communication 
          {/* with the broker on your behalf.  */}
          with the broker. 
          By providing your contact information and a brief description of your issue or inquiry, 
          our team will ensure that your case is addressed promptly and efficiently.
          This service is designed to expedite the resolution process, offering you 
          a seamless experience in addressing your concerns with the broker.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} 
          className="space-y-4 ">
            <label htmlFor="message" className="flex flex-col text-white">
              Select a Message
              <select
                id="message"
                value={selectedMessage}
                onChange={handleMessageChange}
                className="my-2 rounded-lg bg-transparent focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                <option value="">Choose a predefined message...</option>
                {messages.map((msg, index) => (
                  <option key={index} value={msg.value}>
                    {msg.label}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="customMessage" className="flex flex-col text-white">
              Or define your own message
              <input
                type="text"
                id="customMessage"
                value={customMessage}
                onChange={handleCustomMessageChange}
                placeholder="Enter your message..."
                className="my-2 rounded-lg bg-transparent focus:ring-2 focus:ring-purple-500 appearance-none"
              />
            </label>

            <div className="flex items-center space-x-3 text-white">
              <input
                type="checkbox"
                className="my-2 rounded-lg bg-transparent checked:bg-green-600 focus:ring-0 cursor-pointer"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <p>I accept that my data is sent to TradeTab and agree to the terms and conditions.</p>
            </div>

            <div className="w-full mt-48 bottom-1">
              <button
                type="submit"
                className="w-full border-lg bg-green-600 py-4 rounded-xl text-white shadow-xl hover:bg-green-500 duration-300"
              >
                Connect Me Now
              </button>
            </div>

          </form>
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-300">Thank you for providing your details!</p>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-green-600 py-3 px-6 rounded-xl text-white shadow-xl hover:bg-green-500 duration-300"
            >
              Start Chat with TradeTab Agent
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
