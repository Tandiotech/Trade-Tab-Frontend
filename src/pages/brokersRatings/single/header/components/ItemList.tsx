import { useState, useEffect } from 'react';

interface ItemsListProps {
  items: string; // La cadena separada por comas que se recibe
  onInputChange: (value: string, field: string) => void; // Función para enviar la cadena actualizada al padre
  field: string;
}

const ItemsList: React.FC<ItemsListProps> = ({ items, onInputChange, field }) => {
  const [data, setData] = useState(items || '');

  useEffect(() => {
    setData(items); // Sincroniza el estado interno si cambia el prop "items"
  }, [items]);

  const handleAddItem = () => {
    const updatedData = data ? `${data}::` : '';
    setData(updatedData);
    onInputChange(updatedData, field);
  };

  const handleRemoveItem = (index: number) => {
    const itemsArray = data?.split('::');
    const updatedItemsArray = itemsArray.filter((_, i) => i !== index);
    const updatedData = updatedItemsArray.join('::');
    setData(updatedData);
    onInputChange(updatedData, field);
  };

  const handleItemChange = (index: number, value: string) => {
    const itemsArray = data?.split('::');
    itemsArray[index] = value;
    const updatedData = itemsArray.join('::');
    setData(updatedData);
    onInputChange(updatedData, field);
  };

  return (
    <div className='p-4 bg-gray-100 rounded-lg'>
      {data?.split('::').map((item, index) => (
        <div key={index} className='flex items-center mb-2'>
          <input
            type='text'
            value={item}
            onChange={e => handleItemChange(index, e.target.value)}
            className='p-2 border border-gray-300 rounded-lg flex-grow'
          />
          <button
            type='button'
            onClick={() => handleRemoveItem(index)}
            className='ml-2 p-2 bg-red-500 text-white rounded-lg'
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={handleAddItem}
        className='p-2 bg-blue-500 text-white rounded-lg'
      >
        Add Item
      </button>
    </div>
  );
};

export default ItemsList;
