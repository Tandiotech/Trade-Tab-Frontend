import { useState } from 'react';

export default function CPABrokerComponent() {
  // Estados para los inputs de "Clients referred" y "Lots traded"
  const [clientsReferred, setClientsReferred] = useState(18);
  const [lotsTraded, setLotsTraded] = useState(600);

  // Fórmulas simples para calcular los valores mostrados basados en los inputs
  const calculateClientEarnings = () => clientsReferred * 600; // Valor estimado por cliente
  const calculateLotEarnings = () => lotsTraded * 8; // Valor estimado por lote

  return (
<div className='bg-darkblack-500 p-6 text-white shadow-lg w-full mx-auto'>
  {/* Header Section */}
  <div className='text-center space-y-4'>
    <h1 className='text-3xl font-bold'>
      Get up to <span className='text-[#00d08a]'>$600</span> per CPA
    </h1>
    <p className='text-lg'>Per qualified client</p>
    <p>Contact us for more information, and a team member will be in touch.</p>
    <button className='bg-[#00d08a] hover:bg-[#00b57e] text-white font-semibold px-6 py-2 rounded-lg mt-4'>
      MORE INFO
    </button>
  </div>

  {/* Earnings Potential Section */}
  <div className='mt-10 text-center'>
    <h2 className='text-2xl font-semibold mb-6'>Realistic earning potential:</h2>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      <div className='space-y-3'>
        <p className='text-xl font-semibold'>CPA Deal:</p>
        <p className='text-[#00d08a] text-5xl'>$250 ➜ $600</p>
        <p>Per qualified trader</p>
      </div>

      <div className='space-y-3'>
        <p className='text-xl font-semibold'>Rebates Deal:</p>
        <p className='text-[#00d08a] text-5xl'>$8 ➜ $15</p>
        <p>Per lot traded</p>
      </div>
    </div>
  </div>

  {/* Steps Section */}
  <div className='mt-10'>
    <h2 className='text-2xl font-semibold text-center'>How it works:</h2>
    <div className='space-y-6 mt-6'>
      {[
        'Join the broker you want to partner with.',
        'Get set up as a Broker Partner by our team.',
        'Promote your unique link.',
        'Get paid Daily, Bi-Weekly, or Monthly.',
      ].map((step, index) => (
        <div key={index} className='flex items-start space-x-4'>
          <span className='text-lg font-bold bg-[#00d08a] text-white w-8 h-8 flex items-center justify-center rounded-full'>
            {index + 1}
          </span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Earning Potential Section */}
  <div className='mt-10 text-center'>
    <h2 className='text-2xl font-semibold mb-4'>Earning Potential</h2>

    {/* Clients and Lots */}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div>
        <p className='text-lg font-semibold'>Clients referred</p>
        <p className='text-[#00d08a] text-2xl font-bold'>
          {clientsReferred} clients = ${calculateClientEarnings().toLocaleString()} per month
        </p>
        <input
          type='range'
          min='1'
          max='30'
          value={clientsReferred}
          onChange={e => setClientsReferred(Number(e.target.value))}
          className='w-full mt-2'
          style={{ accentColor: '#00d08a' }}
        />
        <div className='flex justify-between text-sm'>
          <p>1 client</p>
          <p>30 clients</p>
        </div>
      </div>

      <div>
        <p className='text-lg font-semibold'>Lots traded</p>
        <p className='text-[#00d08a] text-2xl font-bold'>
          {lotsTraded} lots = ${calculateLotEarnings().toLocaleString()} per month
        </p>
        <input
          type='range'
          min='1'
          max='1000'
          value={lotsTraded}
          onChange={e => setLotsTraded(Number(e.target.value))}
          className='w-full mt-2'
          style={{ accentColor: '#00d08a' }}
        />
        <div className='flex justify-between text-sm'>
          <p>1 lot</p>
          <p>1000 lots</p>
        </div>
      </div>
    </div>

    <button className='bg-[#00d08a] hover:bg-[#00b57e] text-white font-bold px-6 py-3 rounded-lg mt-8'>
      JOIN NOW
    </button>
    <p className='mt-4 text-xs text-gray-400'>
      *Based on Leverage, Number of clients, Country of client, Total Deposits.
    </p>
  </div>
</div>

  );
}
