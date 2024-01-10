import { useState } from 'react';

export const DatePicker = () => {
  const [initialInputValue, setInitialInputValue] = useState('');
  const [endInputValue, setEndInputValue] = useState('');

  const handleInitialInputChange = (e: any) => {
    setInitialInputValue(e.target.value);
  };

  const handleEndInputChange = (e: any) => {
    setEndInputValue(e.target.value);
  };

  return (
    <div>
      <input className="date-picker" type="date" value={initialInputValue} onChange={handleInitialInputChange} />
      To
      <input className="date-picker" type="date" value={endInputValue} onChange={handleEndInputChange} />
    </div>
  );
};
