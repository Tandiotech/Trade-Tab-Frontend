import React from 'react';

const Metric = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div>
    <p className='text-xs text-slate-500'>{label}</p>
    <p className={`text-lg font-semibold ${color ?? 'text-white'}`}>{value}</p>
  </div>
);

export default Metric;
