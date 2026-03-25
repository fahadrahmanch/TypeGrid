import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelect(dateString);
    setIsOpen(false);
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);
    const days = [];

    // Empty cells for padding
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = date === selectedDate;
      const isToday = todayString === date;

      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={`p-2 w-10 h-10 rounded-xl text-xs font-black transition-all border-2 
            ${isSelected 
              ? 'bg-[#ECA468] text-white border-[#ECA468] shadow-lg shadow-[#ECA468]/20' 
              : isToday 
                ? 'border-[#ECA468]/30 text-[#ECA468] bg-orange-50/50' 
                : 'border-transparent text-gray-600 hover:bg-gray-100'
            }`}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-48 px-4 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-[#ECA468]/10 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468]/40 transition-all font-medium text-gray-800 shadow-sm"
      >
        <CalendarIcon className="w-4 h-4 text-[#A468D0]/50" />
        <span className="flex-1 text-left truncate">
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pick a date'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 z-[110] w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h4 className="text-sm font-black text-gray-800 tracking-tight">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <span key={d} className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>

          {selectedDate && (
            <button
              onClick={() => { onSelect(""); setIsOpen(false); }}
              className="mt-4 w-full py-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              Clear Date
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
