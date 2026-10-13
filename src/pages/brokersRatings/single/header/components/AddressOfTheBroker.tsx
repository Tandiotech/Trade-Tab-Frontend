import { MapPin } from 'react-feather';

// Diccionario de palabras clave para países y sus banderas
const flagMapping: { [key: string]: string } = {
  london: '🇬🇧', // UK
  england: '🇬🇧', // UK
  'united kingdom': '🇬🇧', // UK
  'saint lucia': '🇬🇧',
  paris: '🇫🇷', // France
  france: '🇫🇷', // France
  'new york': '🇺🇸', // USA
  'united states': '🇺🇸', // USA
  usa: '🇺🇸', // USA
  berlin: '🇩🇪', // Germany
  germany: '🇩🇪', // Germany
  madrid: '🇪🇸', // Spain
  spain: '🇪🇸', // Spain
  tokyo: '🇯🇵', // Japan
  japan: '🇯🇵', // Japan
  kuwait: '🇰🇼',
  seychelles: '🇸🇨',
  paraguay: '🇵🇾',
  cyprus: '🇨🇾',
  belize: '🇧🇿',
  dubai: '🇦🇪',
  cambodia: '🇦🇪',
  india: '🇮🇳',
  'saint vincent & grenadines': '🇻🇨',

  // Puedes agregar más ciudades y países
};

// Función para detectar la bandera basada en la dirección
const detectFlag = (address: string): string => {
  // Convertimos la dirección a minúsculas para hacer la búsqueda más fácil
  const lowerCasedAddress = address.toLowerCase();

  // Buscamos la primera coincidencia en el diccionario
  for (let keyword in flagMapping) {
    if (lowerCasedAddress.includes(keyword)) {
      return flagMapping[keyword];
    }
  }

  // Si no se encuentra coincidencia, devolver una bandera genérica o vacía
  return '🏳️'; // Bandera blanca como placeholder
};

export default function AddressOfTheBroker({
  address,
  style,
}: {
  address: string;
  style: boolean;
}) {
  // Detectar la bandera correspondiente
  const flag = detectFlag(address);

  return (
    <li className={`flex  ${style ? 'flex-col' : 'items-center space-x-2 '}`}>
      <span className='text-[#5EEAD4] text-base md:text-lg font-semibold whitespace-nowrap'>
        HQ Address:
      </span>
      <div className='flex items-center space-x-2'>
        <MapPin className='fill-red-800 text-Purple-500' />
        <span className='text-white text-base'>
          {address}
          <span className='ml-2'>{flag}</span> {/* Mostrar la bandera */}
        </span>
      </div>
    </li>
  );
}
