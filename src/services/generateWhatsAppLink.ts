export const generateWhatsAppLink = (phoneNumber: string, message: string) => {
  const baseUrl = 'https://wa.me/'; // Base URL de WhatsApp
  const encodedMessage = encodeURIComponent(message);
  return `${baseUrl}${phoneNumber}?text=${encodedMessage}`;
};
