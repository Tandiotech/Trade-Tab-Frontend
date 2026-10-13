import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface HoverContainerProps {
  children: React.ReactNode;
  onCreateLink: () => void;
  name?: string;
  cameraIconLocation?: string;
}

const HoverContainer: React.FC<HoverContainerProps> = ({
  children,
  name = 'Statistics',
  cameraIconLocation = 'bottom-2 right-2',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const childRef = useRef<HTMLDivElement>(null);

  const handleGetImage = async () => {
    if (!childRef.current) {
      console.error('Child content not found.');
      return;
    }
    try {
      const watermark = document.createElement('img');
      watermark.src = '/logo.png'; // Ensure the logo is in the 'public' folder
      watermark.alt = 'Watermark';
      watermark.style.position = 'absolute';
      watermark.style.bottom = '10px';
      watermark.style.right = '10px';
      watermark.style.width = '80px'; // Adjust as needed
      watermark.style.opacity = '0.7'; // Low opacity
      watermark.style.pointerEvents = 'none'; // Prevent interaction
      watermark.style.zIndex = '10';

      childRef.current.appendChild(watermark);

      // Capture the image
      const canvas = await html2canvas(childRef.current, {
        backgroundColor: window.getComputedStyle(childRef.current).backgroundColor || '#ffffff',
        useCORS: true,
        scale: window.devicePixelRatio,
      });

      const image = canvas.toDataURL('image/png');

      // Remove watermark immediately after capturing
      childRef.current.removeChild(watermark);

      // Create a downloadable link
      const link = document.createElement('a');
      link.href = image;
      link.download = `${name.replace(/\s+/g, '_').toLowerCase()}.png`;
      link.click();
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  return (
    <div
      className='relative group h-full'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Buttons */}
      {isHovered && (
        <div className={`absolute ${cameraIconLocation} flex flex-col gap-2 z-10`}>
          {/* <button
            onClick={handleGetImage}
            className='w-10 h-10 bg-gradient-to-r from-transparent to-teal-500 hover:to-transparent text-white opacity-80 rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition'
            title='Get Image'
          >
            📷
          </button> */}
        </div>
      )}

      {/* Child Component */}
      <div ref={childRef} className='relative z-0 w-full h-full'>
        {children}
      </div>
    </div>
  );
};

export default HoverContainer;
