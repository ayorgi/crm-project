'use client';
import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, CheckCircle2, X } from 'lucide-react';
import { apiFetch, transformBackendCustomers } from '@/lib/api';
import {
  CustomerFormModal,
  BookingFormData,
} from '@/components/dashboard/bookings/CustomerFormModal';
import { ConfirmDeleteModal } from '@/components/dashboard/bookings/ConfirmDeleteModal';
import { BookingTableRow } from '@/components/dashboard/bookings/BookingTableRow';
import { BookingFilters } from '@/components/dashboard/bookings/BookingFilters';

const EMPTY: BookingFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  customerType: 'Individual VIP',
  vehicleType: '',
  transferType: '',
  pickupLocation: '',
  dropoffLocation: '',
  transferDate: '',
  transferTime: '',
  flightNumber: '',
  passengers: '',
  notes: '',
  status: 'Confirmed',
};

export default function BookingsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [addForm, setAddForm] = useState<BookingFormData>({ ...EMPTY });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<BookingFormData>({ ...EMPTY });
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<'name' | 'date' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(10);
  const [toast, setToast] = useState<{ message: string; subtext?: string } | null>(null);

  const showToast = (message: string, subtext = 'All updates have been synced') => {
    setToast({ message, subtext });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    apiFetch('/customers')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && Array.isArray(result.data)) {
          const backendCustomers = transformBackendCustomers(result.data);
          setCustomers(backendCustomers);
          localStorage.setItem('customersDB', JSON.stringify(backendCustomers));
        } else {
          const local = JSON.parse(localStorage.getItem('customersDB') || '[]');
          setCustomers(local);
        }
      })
      .catch(err => {
        console.error('Error fetching customers from API, fallback to localStorage:', err);
        const local = JSON.parse(localStorage.getItem('customersDB') || '[]');
        setCustomers(local);
      });
  }, []);

  const setFormField = (setForm: React.Dispatch<React.SetStateAction<BookingFormData>>) => (
    k: string,
    val: string
  ) => setForm(p => ({ ...p, [k]: val }));

  const handleAdd = () => {
    if (!addForm.firstName || !addForm.lastName) return;

    const payload = {
      first_name: addForm.firstName,
      last_name: addForm.lastName,
      email: addForm.email || null,
      phone: addForm.phone || null,
      company: addForm.company || null,
      customer_type: addForm.customerType || 'Individual VIP',
      transfer_type: addForm.transferType || null,
      vehicle_type: addForm.vehicleType || null,
      pickup_location: addForm.pickupLocation || null,
      dropoff_location: addForm.dropoffLocation || null,
      transfer_date: addForm.transferDate || null,
      transfer_time: addForm.transferTime || null,
      flight_number: addForm.flightNumber || null,
      passengers: addForm.passengers || null,
      status: addForm.status || 'Confirmed',
      notes: addForm.notes || null,
    };

    apiFetch('/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && result.data) {
          const transformedNew = transformBackendCustomers([result.data]);
          const updated = [...transformedNew, ...customers];
          setCustomers(updated);
          localStorage.setItem('customersDB', JSON.stringify(updated));
          setAddForm({ ...EMPTY });
          setShowAdd(false);
          showToast('New guest added successfully!', 'Reservation saved to system');
        }
      })
      .catch(err => console.error('Error creating customer in Laravel API:', err));
  };

  const startEdit = (c: any) => {
    if (editId === c.id) {
      setEditId(null);
      return;
    }
    setEditId(c.id);
    setEditForm({ ...EMPTY, ...c });
    setDetailId(null);
    setShowAdd(false);
  };

  const startDuplicate = (c: any) => {
    setAddForm({
      ...EMPTY,
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      email: c.email || '',
      phone: c.phone || '',
      customerType: c.customerType || '',
      vehicleType: c.vehicleType || '',
      transferType: c.transferType || '',
      pickupLocation: c.pickupLocation || '',
      dropoffLocation: c.dropoffLocation || '',
      transferDate: c.transferDate || '',
      transferTime: c.transferTime || '',
      flightNumber: c.flightNumber || '',
      passengers: c.passengers || '',
      notes: c.notes || '',
      status: c.status || '',
    });
    setIsDuplicate(true);
    setShowAdd(true);
    setDetailId(null);
    setEditId(null);
  };

  const handleEditSave = () => {
    if (!editForm.firstName || !editForm.lastName) return;

    const target = customers.find(c => c.id === editId);
    const resId =
      target?.rawResId ||
      (editId && editId.toString().includes('-') ? editId.toString().split('-')[1] : null);
    const realId = target?.rawId || (editId ? editId.toString().split('-')[0] : '');

    const payload = {
      first_name: editForm.firstName,
      last_name: editForm.lastName,
      email: editForm.email || null,
      phone: editForm.phone || null,
      company: editForm.company || null,
      customer_type: editForm.customerType || 'Individual VIP',
      transfer_type: editForm.transferType || null,
      vehicle_type: editForm.vehicleType || null,
      pickup_location: editForm.pickupLocation || null,
      dropoff_location: editForm.dropoffLocation || null,
      transfer_date: editForm.transferDate || null,
      transfer_time: editForm.transferTime || null,
      flight_number: editForm.flightNumber || null,
      passengers: editForm.passengers || null,
      status: editForm.status || 'Pending',
      notes: editForm.notes || null,
      reservation_id: resId,
    };

    const endpoint = resId && resId !== '0' ? `/reservations/${resId}` : `/customers/${realId}`;

    apiFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success' && result.data) {
          const updated = customers.map(c =>
            c.id === editId ? { ...c, ...editForm, id: editId } : c
          );
          setCustomers(updated);
          localStorage.setItem('customersDB', JSON.stringify(updated));

          setEditId(null);
          showToast('Changes saved successfully!', 'Booking details updated');
        }
      })
      .catch(err => console.error('Error updating booking in Laravel API:', err));
  };

  const handleStatusChange = (id: any, newStatus: string) => {
    const updated = customers.map(c => (c.id === id ? { ...c, status: newStatus } : c));
    setCustomers(updated);
    localStorage.setItem('customersDB', JSON.stringify(updated));

    const target = customers.find(c => c.id === id);
    const resId =
      target?.rawResId || (id && id.toString().includes('-') ? id.toString().split('-')[1] : null);
    const realId = target?.rawId || (id ? id.toString().split('-')[0] : '');

    if (resId && resId !== '0') {
      apiFetch(`/reservations/${resId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
        .then(() => showToast(`Status updated to ${newStatus}`, 'Reservation status synced'))
        .catch(err => console.error('Error updating reservation status in backend:', err));
    } else if (realId) {
      apiFetch(`/customers/${realId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, reservation_id: resId }),
      })
        .then(() => showToast(`Status updated to ${newStatus}`, 'Reservation status synced'))
        .catch(err => console.error('Error updating status in backend:', err));
    } else {
      showToast(`Status updated to ${newStatus}`, 'Reservation status updated');
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const resId =
      deleteTarget.rawResId ||
      (deleteTarget.id && deleteTarget.id.toString().includes('-')
        ? deleteTarget.id.toString().split('-')[1]
        : null);
    const realId =
      deleteTarget.rawId || (deleteTarget.id ? deleteTarget.id.toString().split('-')[0] : '');

    const endpoint = resId && resId !== '0' ? `/reservations/${resId}` : `/customers/${realId}`;

    apiFetch(endpoint, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          setCustomers(customers.filter(c => c.id !== deleteTarget.id));
          if (editId === deleteTarget.id) setEditId(null);
          setDeleteTarget(null);
          showToast('Booking deleted', 'The transfer has been removed');
        }
      })
      .catch(err => console.error('Error deleting booking in Laravel API:', err));
  };

  const handleSort = (field: 'name' | 'date') => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortField(null);
    }
  };

  const fullName = (c: any) => (c.firstName ? `${c.firstName} ${c.lastName}` : c.name);

  const getTimestamp = (c: any) => {
    const d = c.transferDate || '';
    const t = c.transferTime || '00:00';
    if (!d) return 0;

    // If d is YYYY-MM-DD
    if (d.includes('-')) {
      const parsed = new Date(`${d}T${t.length === 5 ? t : t.padStart(5, '0')}:00`).getTime();
      if (!isNaN(parsed)) return parsed;
    }

    // If d is DD/MM/YYYY
    if (d.includes('/')) {
      const parts = d.split('/');
      if (parts.length === 3) {
        const iso = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        const parsed = new Date(`${iso}T${t.length === 5 ? t : t.padStart(5, '0')}:00`).getTime();
        if (!isNaN(parsed)) return parsed;
      }
    }

    const fallback = new Date(d).getTime();
    return isNaN(fallback) ? 0 : fallback;
  };

  const filtered = customers
    .filter(c => {
      const name = fullName(c) || '';
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        name.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.flightNumber && c.flightNumber.toLowerCase().includes(q)) ||
        (c.pickupLocation && c.pickupLocation.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === 'name') {
        const na = fullName(a)?.toLowerCase() ?? '';
        const nb = fullName(b)?.toLowerCase() ?? '';
        const cmp = na.localeCompare(nb);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      if (sortField === 'date') {
        const ta = getTimestamp(a);
        const tb = getTimestamp(b);
        if (ta === 0 && tb === 0) return 0;
        if (ta === 0) return 1;
        if (tb === 0) return -1;
        return sortDir === 'asc' ? ta - tb : tb - ta;
      }
      return 0;
    });

  return (
    <div className="pb-10 pt-2">
      {/* Create / Duplicate Modal */}
      <CustomerFormModal
        isOpen={showAdd}
        isDuplicate={isDuplicate}
        value={addForm}
        onChange={setFormField(setAddForm)}
        onSave={handleAdd}
        onClose={() => {
          setShowAdd(false);
          setAddForm({ ...EMPTY });
        }}
      />

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100/80 overflow-hidden flex flex-col">
        {/* Filters Top Bar */}
        <BookingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onNewReservation={() => {
            setIsDuplicate(false);
            setAddForm({ ...EMPTY });
            setShowAdd(true);
          }}
        />

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/70">
                <th className="py-3.5 px-6 w-3/12">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group cursor-pointer"
                  >
                    <span>GUESTS</span>
                    <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <span
                        className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${
                          sortField === 'name' && sortDir === 'asc'
                            ? 'border-b-[#aa2d29]'
                            : 'border-b-gray-400'
                        }`}
                      />
                      <span
                        className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${
                          sortField === 'name' && sortDir === 'desc'
                            ? 'border-t-[#aa2d29]'
                            : 'border-t-gray-400'
                        }`}
                      />
                    </span>
                  </button>
                </th>
                <th className="py-3.5 px-6 w-3/12">TRANSFER</th>
                <th className="py-3.5 px-6 w-4/12">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group cursor-pointer"
                  >
                    <span>ROUTE & DATE</span>
                    <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <span
                        className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${
                          sortField === 'date' && sortDir === 'asc'
                            ? 'border-b-[#aa2d29]'
                            : 'border-b-gray-400'
                        }`}
                      />
                      <span
                        className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${
                          sortField === 'date' && sortDir === 'desc'
                            ? 'border-t-[#aa2d29]'
                            : 'border-t-gray-400'
                        }`}
                      />
                    </span>
                  </button>
                </th>
                <th className="py-3.5 px-6 w-1/12 text-center">STATUS</th>
                <th className="py-3.5 px-6 w-1/12 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {filtered.slice(0, visibleCount).map(c => (
                <BookingTableRow
                  key={c.id}
                  c={c}
                  detailId={detailId}
                  editId={editId}
                  onToggleDetail={id => {
                    setDetailId(p => (p === id ? null : id));
                    setEditId(null);
                  }}
                  onStartEdit={startEdit}
                  onDelete={setDeleteTarget}
                  onDuplicate={startDuplicate}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100/80 border border-gray-200/50 flex items-center justify-center mb-1">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-800 font-bold text-base">
                        {searchTerm.trim()
                          ? `No results found for "${searchTerm}"`
                          : statusFilter === 'In Transit'
                          ? 'No active transfers in transit'
                          : statusFilter === 'Confirmed'
                          ? 'No confirmed reservations found'
                          : statusFilter === 'Pending'
                          ? 'No pending bookings found'
                          : statusFilter === 'Completed'
                          ? 'No completed transfers found'
                          : statusFilter === 'Cancelled'
                          ? 'No cancelled bookings'
                          : 'No VIP guests found'}
                      </p>
                      <p className="text-gray-400 text-xs max-w-sm mx-auto">
                        {searchTerm.trim()
                          ? 'Try searching for a different guest name, partner, location, or flight number.'
                          : 'Start by adding a new reservation.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > visibleCount && (
          <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              Show More (+{filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <CustomerFormModal
        isOpen={editId !== null}
        title="Edit Booking"
        value={editForm}
        onChange={setFormField(setEditForm)}
        onSave={handleEditSave}
        onClose={() => setEditId(null)}
        saveLabel="Save Changes"
      />

      {/* Confirm Deletion Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          name={fullName(deleteTarget)}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3.5 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
            {toast.subtext && <p className="text-xs text-gray-400 mt-0.5">{toast.subtext}</p>}
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}