import React, {useState, useEffect} from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/button.jsx';

function Header({ selectedDate, setSelectedDate, openModal }) {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const currentDate = new Date();
    const months = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      months.push(monthYear);
    }

    setDates(months);
    if (!selectedDate) {
      setSelectedDate(months[0]);
    }
  }, []);

  return (
    <header className="bg-white border-b p-4">
      <div className="flex justify-between items-center">
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded p-2"
        >
          {dates.map(date => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        <Button onClick={() => openModal('category')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>
    </header >
  );
};

export default Header;