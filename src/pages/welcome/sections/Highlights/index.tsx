import { useState, useEffect } from 'react';
import Row from './Row';
import { BACKEND_URL } from '../../../../utils/GlobalVars';
import axios from 'axios';
import mock from '../../mock/highlight.json';

const Highlights = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setMetrics(mock.data);
      const uri = BACKEND_URL + 'account/getTopAccountsByDailyGrowth';
      try {
        const response = await axios.get(uri);
        // setMetrics(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (metrics.length === 0) return null;

  return (
    <section className='max-w-7xl mx-auto'>
      <h1 className='font-poppins antialiased text-white text-3xl'>Highlights</h1>
      <p></p>

      <div className='mt-5 grid grid-cols-4 gap-5'>
        <p className='font-poppins antialiased text-white'>Name</p>
        <p className='font-poppins antialiased text-white'>Profit</p>
        <p className='font-poppins antialiased text-white'>Gain</p>
        <p></p>
      </div>
      <div className='mt-5 grid grid-cols-4 gap-5 auto-rows-max max-h-[428px] overflow-y-scroll'>
        {metrics.map((element: any) => (
          <Row key={element.id} {...element} />
          // <div key={element.id} {...element} >
          //   asd
          // </div>
        ))}
      </div>
    </section>
  );
};

export default Highlights;
