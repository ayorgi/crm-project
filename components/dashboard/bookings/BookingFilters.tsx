'use client';
import React from 'react';
import { Search, PlusCircle } from 'lucide-react';

interface BookingFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onNewReservation: () => void;
}

const statusTabs = ['All', 'Confirmed', 'Pending', 'In Transit', 'Completed', 'Cancelled'];

export function BookingFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onNewReservation,
}: BookingFiltersProps) {
  return (
    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, flight no., partner, pick-up location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50/60 border border-gray-200/80 rounded-xl text-sm focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
        {statusTabs.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === s
                ? 'bg-[#aa2d29] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={onNewReservation}
        className="hidden md:flex items-center justify-center gap-2 bg-[#aa2d29] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#8e2622] transition-colors shadow-sm shrink-0 cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        <span>New Reservation</span>
      </button>
    </div>
  );
}
