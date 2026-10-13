import React, { useState } from 'react';
import { SeparadorDecimal } from '../../../utils/SeparadorDecimal';

interface DailyGoalProps {
  onGoalChange: (goal: number) => void;
  balance: number;
}

const DailyGoal: React.FC<DailyGoalProps> = ({ onGoalChange, balance }) => {
  const [goal, setGoal] = useState<number | any>('');
  const [isAbsolute, setIsAbsolute] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setGoal(value);
    onGoalChange(value);
  };

  const handlePercentClick = (percent: number) => {
    const value = (balance * percent) / 100;
    setGoal(value.toFixed(2));
    onGoalChange(value);
  };

  const handleToggleChange = () => {
    setIsAbsolute(!isAbsolute);
    setGoal('');
  };

  const time_percents = ['0.1%', '0.3%', '0.5%', '1.0%'];

  return (
    <div className='p-4 rounded-lg shadow-lg max-w-md mx-auto bg-white'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Daily Profit Goal</h2>
      <div className='flex justify-center mb-4'>
        <label className='inline-flex items-center'>
          <input
            type='checkbox'
            className='form-checkbox'
            checked={isAbsolute}
            onChange={handleToggleChange}
          />
          <span className='ml-2 text-lg text-gray-800'>Set in absolute value</span>
        </label>
      </div>
      <label htmlFor='daily-goal' className='block text-lg font-medium mb-2'>
        {isAbsolute
          ? 'Set your daily profit goal (absolute value):'
          : 'Set your daily profit goal (%):'}
      </label>
      <input
        type='number'
        id='daily-goal'
        value={goal}
        onChange={handleChange}
        min={isAbsolute ? 0 : 1}
        max={isAbsolute ? balance : 100}
        className='w-full block mx-auto text-black p-2 border border-gray-300 rounded-lg text-center'
      />
      <p className='text-end text-black opacity-70'>Value: ${SeparadorDecimal(goal)} USD</p>
      {!isAbsolute && (
        <div className='flex space-x-4 justify-center items-center mt-3'>
          {time_percents.map((item, key) => (
            <button
              key={key}
              onClick={() => handlePercentClick(parseFloat(item))}
              className='bg-blue-400 hover:bg-blue-600 text-white p-1 rounded-lg'
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <p className='mt-2 text-sm text-gray-600'>
        Set a goal between 1% and 100% or an absolute value up to your balance.
      </p>
      {/* {goal && !isAbsolute && (
        <p className="mt-2 text-lg text-gray-800">Relative Value: {SeparadorDecimal((balance * goal / 100).toFixed(2))} USD</p>
      )} */}

      {goal && isAbsolute && (
        <p className='mt-2 text-lg text-gray-800'>Target Value: {SeparadorDecimal(goal)} USD</p>
      )}
    </div>
  );
};

export default DailyGoal;
