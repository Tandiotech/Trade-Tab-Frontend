import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { CiMicrophoneOn } from "react-icons/ci";
import { FaPaperclip } from "react-icons/fa";

function TeamChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, what can I help you with?", sender: "system", time: "10:00 PM" }
  ]);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: "user",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  return (
    <div className="flex w-full flex-col justify-between rounded-lg border-darkblack-400 lg:w-full 2xl:w-full">
      <div className="flex justify-between border-b border-b-gray-300 px-6 py-6 dark:border-darkblack-400">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Team Chat</h1>
        <div className="flex items-center space-x-3">
          <img src={"/logo.png"} className="w-14 rounded-full" alt="members" />
        </div>
      </div>

      <div className="w-full px-5 py-6 lg:px-7 lg:py-8">
        <div className="mb-5 flex flex-col space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "system" ? "justify-start" : "justify-end"}`}>
              <div className="flex items-end space-x-3">
                {msg.sender === "system" && (
                  <img src={"/logo.png"} alt="avatar" className="w-10" />
                )}
                <div className="flex items-center space-x-2">
                  <div className={`rounded-lg bg-gray-100 p-3 dark:bg-darkblack-500`}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {msg.text}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{msg.time}</span>
                </div>
                {msg.sender === "user" && (
                  <img src={"assets/img/profile_1.webp"} alt="avatar" className="w-10" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex h-14 items-center space-x-4">
          <FaPaperclip className="cursor-pointer" />
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="grow border-none p-2 font-medium placeholder:text-sm placeholder:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:bg-darkblack-500 dark:text-white"
          />
          <CiMicrophoneOn size={23} className="cursor-pointer" />
          <button
            className="text-teal-500 text-2xl"
            aria-label="Send Message"
            type="button"
            onClick={handleSendMessage}
          >
            <BsFillSendFill />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamChat;
