import { RUTE_UPDLOAD_BROKER_LOGO } from '../../../utils/Rutes';
import { http } from '../../../utils/http_request';

export default function LogoUpdateHandler({ values, field, handleChange }: any) {
  // Función para manejar la selección de archivos
  const handleFileSelect = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('logo', file);

      try {
        const response = await http.post(RUTE_UPDLOAD_BROKER_LOGO, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Suponiendo que el backend devuelve la URL de la imagen en la respuesta
        // handleChange({ target: { value: BACKEND_URL+response.data.filePath } }, field);
        handleChange({ target: { value: response.data.filePath } }, field);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div className='flex'>
      URL
      <input
        type='text'
        value={values[field] || ''}
        onChange={e => handleChange(e, field)}
        className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300'
      />
      or
      <label className='bg-teal-600 m-1 text-white rounded text-sm p-1 cursor-pointer'>
        Select file
        <input type='file' onChange={handleFileSelect} style={{ display: 'none' }} />
      </label>
    </div>
  );
}
