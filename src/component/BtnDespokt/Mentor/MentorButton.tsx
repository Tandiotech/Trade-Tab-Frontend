import { useState, useEffect, type FC, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FaWhatsapp, FaRocket, FaChartLine, FaLightbulb } from 'react-icons/fa';
import { IoMdClose, IoMdSend } from 'react-icons/io';
import './mentorModal.shell.css';

interface QuickMessage {
  icon: ReactNode;
  text: string;
  emoji: string;
}

const MentorButtonWithModal: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // WhatsApp phone number
  const phoneNumber = '447494208836';
  
  // Quick message suggestions - casual and inviting
  const quickMessages: QuickMessage[] = [
    { icon: <FaRocket />, text: "Hey! I need help with my trading strategy 🚀", emoji: "🚀" },
    { icon: <FaChartLine />, text: "Can you help me analyze my recent trades? 📊", emoji: "📊" },
    { icon: <FaLightbulb />, text: "I have a question about risk management 💡", emoji: "💡" },
  ];

  const handleQuickMessage = (message: string) => {
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    setIsOpen(false);
  };

  const handleCustomMessage = () => {
    if (!customMessage.trim()) return;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;
    window.open(whatsappURL, '_blank');
    setIsOpen(false);
    setCustomMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomMessage();
    }
  };

  return (
    <>
      {/* Mentor Button - Updated with TradeTab colors */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type='button'
        className='group relative hidden h-9 shrink-0 items-center gap-2 rounded-lg border border-emerald-500/35 bg-emerald-700/90 px-3 text-sm font-medium text-white transition hover:border-emerald-400/45 hover:bg-emerald-600 md:flex'
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-label='Open mentor chat options'
      >
        <span className='hidden sm:inline'>Mentor</span>
        <FaWhatsapp className='h-[1.1rem] w-[1.1rem] shrink-0 opacity-95 group-hover:opacity-100' aria-hidden />
      </button>

      {isOpen &&
        createPortal(
          <div
            className='fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:px-10'
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
            role='presentation'
            onClick={e => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div
              id='tt-mentor-modal'
              className='w-full max-w-[min(1100px,calc(100vw-2rem))] max-h-[min(94vh,900px)] flex flex-col min-h-0'
              onClick={e => e.stopPropagation()}
            >
              <div
                className='calc flex max-h-[min(92vh,880px)] min-h-0 flex-col overflow-hidden'
                role='dialog'
                aria-modal='true'
                aria-labelledby='mentor-modal-title'
              >
                <div className='head shrink-0'>
                  <div className='head-mark'>
                    <FaWhatsapp aria-hidden />
                  </div>
                  <div className='head-text'>
                    <h1 id='mentor-modal-title'>Chat with Mentor</h1>
                    <p>Online · Ready to help</p>
                  </div>
                  <div className='head-meta'>
                    <span className='dot' aria-hidden />
                    WhatsApp
                  </div>
                  <button type='button' className='head-close' aria-label='Close' onClick={() => setIsOpen(false)}>
                    <IoMdClose className='text-lg' aria-hidden />
                  </button>
                </div>

                <div className='body min-h-0 flex-1 overflow-y-auto overscroll-contain'>
                  <div className='mentor-banner'>
                    👋 <strong>Hey there, trader!</strong>
                    <br />
                    <span className='muted'>Need help? Message us on WhatsApp — we're here to chat.</span>
                  </div>

                  <div className='mentor-section-label'>Quick start</div>
                  <div className='mentor-quick'>
                    {quickMessages.map((msg, idx) => (
                      <button
                        key={idx}
                        type='button'
                        className='mentor-quick-btn'
                        onClick={() => handleQuickMessage(msg.text)}
                      >
                        <span className='mentor-quick-icon'>{msg.icon}</span>
                        <span className='min-w-0 flex-1'>{msg.text}</span>
                        <IoMdSend className='shrink-0 text-[var(--accent-2)] opacity-70' aria-hidden />
                      </button>
                    ))}
                  </div>

                  <div className='mentor-divider'>
                    <span>or type your own</span>
                  </div>

                  <div className='mentor-field-label'>Your message</div>
                  <div className='mentor-textarea-wrap'>
                    <textarea
                      className='mentor-textarea'
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder='Type your message...'
                      rows={4}
                    />
                    <span className='mentor-textarea-hint'>Enter to send</span>
                  </div>

                  <button
                    type='button'
                    className='mentor-send'
                    disabled={!customMessage.trim()}
                    onClick={handleCustomMessage}
                  >
                    <FaWhatsapp aria-hidden />
                    Send to WhatsApp
                    <IoMdSend aria-hidden />
                  </button>
                </div>

                <div className='footbar shrink-0'>
                  <div className='left'>Opens WhatsApp in a new tab</div>
                  <div className='right'>
                    <button type='button' className='primary-btn' onClick={() => setIsOpen(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default MentorButtonWithModal;

