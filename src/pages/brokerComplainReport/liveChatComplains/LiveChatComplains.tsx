import { useEffect, useState } from 'react';

interface Message {
  from: 'user' | 'system' | 'agent';
  text: string;
}

const LiveChatComplains = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    // Mensaje inicial del sistema al cargar el componente
    setTimeout(() => {
      setMessages([
        { from: 'system', text: 'Thank you for contacting TradeTab support. We are connecting you to an agent.' }
      ]);

      // Simula la llegada de un agente después de 5 segundos
      setTimeout(() => {
        const agentResponses = [
          "Hello, I'm Allison from TradeTab. How can I assist you today?",
        //   "Hi there, thanks for reaching out. What seems to be the issue?",
        //   "Good day! I'm ready to assist you. Please tell me more about your problem."
        ];


        const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
        setMessages(prev => [...prev, { from: 'agent', text: randomResponse }]);
      }, 4000);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages(prev => [...prev, { from: 'user', text: userInput }]);
      setUserInput('');
    }
  };

  const contactOptions = [
    { name: 'Continue on Telegram', icon: 'telegram' },
    { name: 'Continue on WhatsApp', icon: 'whatsapp' }
  ];

  return (
    <div className="bg-slate-300 shadow-md rounded-lg p-4 w-full mx-auto my-4">
      <div className="h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded-lg m-2 ${msg.from === 'user' ? 'bg-cyan-500 text-white' : msg.from === 'agent' ? 'bg-cyan-300 text-black' : 'bg-cyan-200 text-black'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border rounded-lg p-2 flex-1"
          placeholder="Type your message here..."
        />
        <button
          onClick={handleSendMessage}
          className=" bg-cyan-600 text-white px-4 py-2 rounded-lg ml-2"
        >
          Send
        </button>
      </div>

      {messages.some(msg => msg.from === 'agent') && (
        <div className="flex justify-around mt-4">
          {contactOptions.map((option, index) => (
            <button key={index} className="bg-teal-500 hover:bg-teal-400 text-white px-3 py-2 rounded-lg">
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveChatComplains;
