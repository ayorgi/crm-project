/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { Search, Info, Pencil, X, User, Users, Mail, Phone, Building2, CheckCircle2, Car } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFetch, transformBackendCustomers } from '@/lib/api';
import { parseDate } from '@/lib/dateUtils';

import { PARTNERS, GUEST_TYPES, STATUSES } from '@/lib/constants';

const fullName = (g: any) => g.firstName ? `${g.firstName} ${g.lastName}`.trim() : g.name || '—';

const statusColors: Record<string, string> = {
  Confirmed: 'bg-emerald-400',
  Completed: 'bg-blue-400',
  'In Transit': 'bg-amber-400',
  Pending: 'bg-gray-400',
  Cancelled: 'bg-red-400',
};

const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400";

type UniqueGuest = {
  customerId: string;
  rawId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  customerType: string;
  createdAt: string;
  bookings: any[];
};

function buildUniqueGuests(allRows: any[]): UniqueGuest[] {
  const map: Record<string, UniqueGuest> = {};
  for (const row of allRows) {
    const key = row.customerId || row.id?.toString();
    if (!key) continue;
    if (!map[key]) {
      map[key] = {
        customerId: key,
        rawId: row.rawId,
        firstName: row.firstName || '',
        lastName: row.lastName || '',
        email: row.email || '',
        phone: row.phone || '',
        company: row.company || '',
        customerType: row.customerType || 'Individual VIP',
        createdAt: row.createdAt || '',
        bookings: [],
      };
    }
    if (row.transferType) {
      map[key].bookings.push(row);
    }
  }
  return Object.values(map).sort((a, b) => b.rawId - a.rawId);
}

function StatusDots({ bookings }: { bookings: any[] }) {
  const counts: Record<string, number> = {};
  for (const b of bookings) counts[b.status] = (counts[b.status] || 0) + 1;
  const order = ['Confirmed', 'In Transit', 'Pending', 'Completed', 'Cancelled'];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {order.filter(s => counts[s]).map(s => (
        <span key={s} title={`${counts[s]} ${s}`} className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${statusColors[s] || 'bg-gray-300'}`} />
          <span className="text-xs text-gray-400">{counts[s]}</span>
        </span>
      ))}
    </div>
  );
}

function GuestDetailPanel({ guest, onClose }: { guest: UniqueGuest; onClose: () => void }) {
  return (
    <tr>
      <td colSpan={5} className="px-6 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Profile — {fullName(guest)}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#aa2d29]"><User className="w-3.5 h-3.5" /></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identity</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{fullName(guest)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{guest.customerType}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#aa2d29]"><Mail className="w-3.5 h-3.5" /></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</span>
            </div>
            {guest.email && <p className="text-sm font-semibold text-gray-800 break-all">{guest.email}</p>}
            {guest.phone && <p className="text-xs text-gray-400 mt-1">{guest.phone}</p>}
            {!guest.email && !guest.phone && <p className="text-sm text-gray-300">—</p>}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#aa2d29]"><Building2 className="w-3.5 h-3.5" /></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner</span>
            </div>
            <p className="text-sm font-semibold text-gray-800">{guest.company || '—'}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#aa2d29]"><Car className="w-3.5 h-3.5" /></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bookings</span>
            </div>
            <p className="text-2xl font-black text-[#aa2d29]">{guest.bookings.length}</p>
            <p className="text-xs text-gray-400">total transfers</p>
          </div>
        </div>
        {guest.bookings.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transfer History</span>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {guest.bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 w-36">{b.transferDate ? `${b.transferDate}${b.transferTime ? ' · ' + b.transferTime : ''}` : '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{b.transferType || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{b.vehicleType || ''}{b.passengers ? ` · ${b.passengers} pax` : ''}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{b.pickupLocation || '—'} → {b.dropoffLocation || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        b.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        b.status === 'In Transit' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        b.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </td>
    </tr>
  );
}

function EditGuestModal({ guest, onClose, onSave }: {
  guest: UniqueGuest;
  onClose: () => void;
  onSave: (data: Partial<UniqueGuest>) => void;
}) {
  const [firstName, setFirstName] = useState(guest.firstName);
  const [lastName, setLastName] = useState(guest.lastName);
  const [email, setEmail] = useState(guest.email);
  const [phone, setPhone] = useState(guest.phone);
  const [company, setCompany] = useState(guest.company);
  const [customerType, setCustomerType] = useState(
    guest.company ? 'B2B Partner' : (guest.customerType || 'Individual VIP')
  );

  const handlePartnerChange = (val: string | null) => {
    const newCompany = (val === 'No Partner' || val === 'none' || !val) ? '' : val;
    setCompany(newCompany);
    setCustomerType(newCompany ? 'B2B Partner' : 'Individual VIP');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Guest Profile</h3>
            <p className="text-sm text-gray-400 mt-0.5">Update contact and profile information only.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">First Name</label>
            <input className={inp} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
            <input className={inp} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
            <input className={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</label>
            <input className={inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+44 7700 000000" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">B2B Partner</label>
            <Select value={company || 'No Partner'} onValueChange={handlePartnerChange}>
              <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 rounded-lg">
                <SelectValue placeholder="Select hotel / partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="No Partner">No Partner</SelectItem>
                  {PARTNERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Type</label>
            <input
              className={inp + " bg-gray-100/80 text-gray-500 font-semibold cursor-not-allowed"}
              value={customerType}
              readOnly
              title="Auto-calculated based on B2B Partner"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => onSave({ firstName, lastName, email, phone, company, customerType })}
            className="px-6 py-2 rounded-lg text-sm font-semibold bg-[#aa2d29] text-white hover:bg-[#8e2622] transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<UniqueGuest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editGuest, setEditGuest] = useState<UniqueGuest | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [sortField, setSortField] = useState<'name'|'bookings'|'createdAt'|null>(null);
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [visibleCount, setVisibleCount] = useState(10);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    apiFetch('/customers')
      .then(r => r.json())
      .then(result => {
        if (result.status === 'success' && Array.isArray(result.data)) {
          setGuests(buildUniqueGuests(transformBackendCustomers(result.data)));
        } else {
          setGuests(buildUniqueGuests(JSON.parse(localStorage.getItem('customersDB') || '[]')));
        }
      })
      .catch(() => setGuests(buildUniqueGuests(JSON.parse(localStorage.getItem('customersDB') || '[]'))));
  }, []);

  const filtered = guests.filter(g => {
    const q = searchTerm.toLowerCase();
    return fullName(g).toLowerCase().includes(q) || g.email?.toLowerCase().includes(q) || g.phone?.toLowerCase().includes(q) || g.company?.toLowerCase().includes(q);
  }).sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === 'name') cmp = fullName(a).localeCompare(fullName(b));
    else if (sortField === 'bookings') cmp = a.bookings.length - b.bookings.length;
    else if (sortField === 'createdAt') {
      const ta = parseDate(a.createdAt || '').getTime();
      const tb = parseDate(b.createdAt || '').getTime();
      cmp = ta - tb;
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleSort = (field: 'name'|'bookings'|'createdAt') => {
    if (sortField !== field) { setSortField(field); setSortDir('asc'); }
    else if (sortDir === 'asc') { setSortDir('desc'); }
    else { setSortField(null); }
  };

  const handleSaveEdit = (data: Partial<UniqueGuest>) => {
    if (!editGuest) return;
    apiFetch(`/customers/${editGuest.rawId}`, {
      method: 'PUT',
      body: JSON.stringify({
        first_name: data.firstName, last_name: data.lastName,
        email: data.email || null, phone: data.phone || null,
        company: data.company || null, customer_type: data.customerType || 'Individual VIP',
      })
    }).then(r => r.json()).then(result => {
      if (result.status === 'success') {
        setGuests(prev => prev.map(g => g.customerId === editGuest.customerId ? { ...g, ...data } : g));
        showToast('Guest profile updated successfully!');
      }
    }).catch(() => {});
    setEditGuest(null);
  };

  return (
    <div className="pb-10 pt-2">
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100/80 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search guests by name, email, phone or partner..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50/60 border border-gray-200/80 rounded-xl text-sm focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span><strong className="text-gray-800">{filtered.length}</strong> unique guests</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/70">
                <th className="py-3.5 px-6 w-5/12">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group">
                    <span>GUEST</span>
                    <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${sortField === 'name' && sortDir === 'asc' ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                      <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${sortField === 'name' && sortDir === 'desc' ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                    </span>
                  </button>
                </th>
                <th className="py-3.5 px-6 w-2/12">
                  <button onClick={() => handleSort('bookings')} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group">
                    <span>BOOKINGS</span>
                    <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${sortField === 'bookings' && sortDir === 'asc' ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                      <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${sortField === 'bookings' && sortDir === 'desc' ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                    </span>
                  </button>
                </th>
                <th className="py-3.5 px-6 w-2/12">Partner</th>
                <th className="py-3.5 px-6 w-2/12">
                  <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group">
                    <span>SINCE</span>
                    <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${sortField === 'createdAt' && sortDir === 'asc' ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                      <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${sortField === 'createdAt' && sortDir === 'desc' ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                    </span>
                  </button>
                </th>
                <th className="py-3.5 px-6 w-1/12 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {filtered.slice(0, visibleCount).map(g => (
                <React.Fragment key={g.customerId}>
                  <tr className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#aa2d29]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#aa2d29]">{(g.firstName?.[0] || '?').toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{fullName(g)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {g.email || g.phone ? `${g.email || ''}${g.email && g.phone ? ' · ' : ''}${g.phone || ''}` : (g.customerType || '—')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {g.bookings.length === 0 ? (
                        <span className="text-gray-300 text-xs">No bookings</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                          {g.bookings.length} booking{g.bookings.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{g.company || '—'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-400">{g.createdAt || '—'}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setDetailId(p => p === g.customerId ? null : g.customerId)} title="View Details"
                          className={`p-1.5 rounded-lg transition-colors ${detailId === g.customerId ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}>
                          <Info className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditGuest(g)} title="Edit Guest Profile"
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-[#aa2d29]/10 hover:text-[#aa2d29] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {detailId === g.customerId && <GuestDetailPanel guest={g} onClose={() => setDetailId(null)} />}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100/80 border border-gray-200/50 flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-800 font-bold text-base">No guests found</p>
                    <p className="text-gray-400 text-xs">Try a different search term.</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < filtered.length && (
          <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/30">
            <button
              onClick={() => setVisibleCount(p => p + 10)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
            >
              Show {Math.min(10, filtered.length - visibleCount)} more guests
            </button>
          </div>
        )}
      </div>

      {editGuest && <EditGuestModal guest={editGuest} onClose={() => setEditGuest(null)} onSave={handleSaveEdit} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3.5 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-sm font-bold">{toast}</p>
          <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
