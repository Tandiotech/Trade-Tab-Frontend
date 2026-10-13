import { generateWhatsAppLink } from "@/services/generateWhatsAppLink";

export const handleWhatsAppClick = () => {
    window.open(
      generateWhatsAppLink(import.meta.env.VITE_PHONE_SUPPORT||'+447494208836', `I want to start trading now`),
      '_blank'
    );
  };