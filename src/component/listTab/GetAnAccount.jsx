import { generateWhatsAppLink } from '../../services/generateWhatsAppLink';
import AnimatedText from '../AnimateText';

export default function GetAnAccount({
  className = 'cursor-pointer bg-teal-600 text-white p-2 rounded-md hover:bg-green-600',
  style=false,
}) {
  const handleWhatsAppClick = () => {
    window.open(
      generateWhatsAppLink('+447494208836', `I dont have an account to connect to TradeTab`),
      '_blank'
    );
  };
  return (
    <div className={className} onClick={handleWhatsAppClick}>
      <AnimatedText style={style} value={"Don't have an account?"} textSize='text-base' />
    </div>
  );
}
