import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../../utils/GlobalVars';
import { RUTE_GET_ARTICLES_PERBROKER } from '../../../../utils/Rutes';
import GlobalModal from '../../../../component/modal/GlobalModal';
import RouletteArticles from './RouletteArticles';

interface ImageSliderProps {
  images: string[];
}

function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length); // Cambiar imagen cada 5 segundos
    }, 5000);
    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
  }, [images]);

  return (
    <div className='relative w-3/4 h-96 overflow-hidden rounded-md shadow-md'>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

export default function LatestArticles({
  brokerId,
  isAdmin,
}: {
  brokerId: string;
  isAdmin: boolean;
}) {
  const [newArticleModal, setNewArticleModal] = useState(false);
  const [brokerArticles, setBrokerArticles] = useState<any[]>([]);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleLink, setArticleLink] = useState('');
  const [image, setImage] = useState<File | null>(null); // Nuevo estado para manejar la imagen

  useEffect(() => {
    axios.get(`${BACKEND_URL}${RUTE_GET_ARTICLES_PERBROKER}${brokerId}`).then(response => {
      setBrokerArticles(response.data.articles || []);
    });
  }, [brokerId]);

  const handleAddArticle = async () => {
    const formData = new FormData();
    formData.append('title', articleTitle);
    formData.append('content', articleContent);
    formData.append('link', articleLink);
    formData.append('brokerId', brokerId);
    if (image) {
      formData.append('img', image); // Adjuntar la imagen si existe
    }

    try {
      const response = await axios.post(`${BACKEND_URL}articles`, formData);
      setBrokerArticles([...brokerArticles, response.data.article]);
      setNewArticleModal(false);
      setArticleTitle('');
      setArticleContent('');
      setArticleLink('');
      setImage(null);
    } catch (error) {
      console.error('Error adding new article:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Asignar la imagen al estado
    }
  };

  return (
    <div className='flex flex-col items-center gap-5 mt-2 w-[100%]'>
      {/* Image slider */}
      <ImageSlider images={['/banner_metrics2.png', '/banner_journal.png']} />

      <>
        <h2 className='text-xl antialiased mt-24'>Articles about the broker</h2>

        {isAdmin && (
          <button
            onClick={() => setNewArticleModal(true)}
            className='mb-2 p-2 bg-blue-500 text-white rounded shadow'
          >
            Add New Article
          </button>
        )}

        <GlobalModal
          isActive={newArticleModal}
          height='h-[50vh]'
          width='w-[70vw] lg:w-1/3'
          onClose={() => setNewArticleModal(false)}
        >
          <h2 className='text-center'>Add Article</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAddArticle();
            }}
            encType='multipart/form-data'
            className='p-6'
          >
            <input
              type='text'
              placeholder='Title'
              value={articleTitle}
              onChange={e => setArticleTitle(e.target.value)}
              className='block w-full mb-2 p-1'
            />
            <textarea
              placeholder='Content'
              value={articleContent}
              onChange={e => setArticleContent(e.target.value)}
              className='block w-full mb-2 p-1'
              rows={3}
            />
            <input
              type='text'
              placeholder='Link'
              value={articleLink}
              onChange={e => setArticleLink(e.target.value)}
              className='block w-full mb-2 p-1'
            />
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='block w-full mb-2 p-1'
            />
            <button type='submit' className='w-full bg-green-600 text-white p-2 rounded'>
              Submit Article
            </button>
          </form>
        </GlobalModal>
        {/* Articles about the broker */}
        <RouletteArticles articles={brokerArticles} />
      </>
    </div>
  );
}
