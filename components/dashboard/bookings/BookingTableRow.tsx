'use client';
import React from 'react';
import { MapPin, Calendar, Info, Pencil, Trash2 } from 'lucide-react';
import { formatDisplayDate, statusStyle } from '@/lib/bookingNotesUtils';
import { STATUSES } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookingDetailPanel } from './BookingDetailPanel';

interface BookingTableRowProps {
  c: any;
  detailId: number | null;
  editId: number | null;
  onToggleDetail: (id: number) => void;
  onStartEdit: (c: any) => void;
  onDelete: (c: any) => void;
  onDuplicate: (c: any) => void;
  onStatusChange?: (id: any, newStatus: string) => void;
}

export function BookingTableRow({
  c,
  detailId,
  editId,
  onToggleDetail,
  onStartEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
}: BookingTableRowProps) {
  const fullName = c.firstName ? `${c.firstName} ${c.lastName}` : c.name;
  const isDetailOpen = detailId === c.id;

  return (
    <React.Fragment key={c.id}>
      <tr className="hover:bg-gray-50/60 transition-colors">
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#aa2d29]/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-[#aa2d29]">
                {(c.firstName?.[0] || c.name?.[0] || '?').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">{fullName}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {c.customerType || '—'}
                {c.company ? ` · ${c.company}` : ''}
              </p>
            </div>
          </div>
        </td>

        <td className="py-4 px-6">
          {!c.transferType ? (
            <span className="text-gray-300 text-sm">—</span>
          ) : (
            <>
              <p className="font-medium text-gray-800">{c.transferType || '—'}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {c.vehicleType || ''}
                {c.passengers ? ` · ${c.passengers} pax` : ''}
              </p>
            </>
          )}
        </td>

        <td className="py-4 px-6">
          {!c.transferType ? (
            <span className="text-gray-300 text-sm">—</span>
          ) : (
            <>
              {c.pickupLocation || c.dropoffLocation ? (
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {c.pickupLocation || '—'}
                  </p>
                  <p className="text-xs text-gray-400 pl-3.5">{c.dropoffLocation || '—'}</p>
                </div>
              ) : (
                <span className="text-gray-400">—</span>
              )}
              {c.transferDate && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  {formatDisplayDate(c.transferDate)}
                  {c.transferTime ? ` at ${c.transferTime}` : ''}
                </p>
              )}
            </>
          )}
        </td>

        <td className="py-4 px-6 text-center">
          {c.status === 'New' || !c.transferType ? (
            <span className="text-gray-400">—</span>
          ) : (
            <div className="inline-flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <Select
                value={c.status || 'Pending'}
                onValueChange={val => {
                  if (val && onStatusChange) onStatusChange(c.id, val);
                }}
              >
                <SelectTrigger
                  title="Click to change status"
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border h-auto cursor-pointer shadow-none focus:ring-1 focus:ring-[#aa2d29]/30 outline-none select-none transition-all hover:opacity-80 ${statusStyle(
                    c.status
                  )}`}
                >
                  <SelectValue>{c.status || 'Pending'}</SelectValue>
                </SelectTrigger>
                <SelectContent align="center" className="w-36 text-xs font-medium">
                  {STATUSES.map(s => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            s === 'Confirmed'
                              ? 'bg-emerald-500'
                              : s === 'Pending'
                              ? 'bg-gray-400'
                              : s === 'In Transit'
                              ? 'bg-amber-500'
                              : s === 'Completed'
                              ? 'bg-blue-500'
                              : 'bg-red-500'
                          }`}
                        />
                        {s}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </td>

        <td className="py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => onToggleDetail(c.id)}
              title="View Details"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDetailOpen
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => onStartEdit(c)}
              title="Edit"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editId === c.id
                  ? 'bg-[#aa2d29]/10 text-[#aa2d29]'
                  : 'text-gray-400 hover:bg-[#aa2d29]/10 hover:text-[#aa2d29]'
              }`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(c)}
              title="Remove"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {isDetailOpen && (
        <BookingDetailPanel
          key={`d-${c.id}`}
          c={c}
          onClose={() => onToggleDetail(c.id)}
          onDuplicate={() => onDuplicate(c)}
        />
      )}
    </React.Fragment>
  );
}
