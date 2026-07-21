/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Info, Pencil, Trash2, X, Car, User, Calendar, MapPin, Plane, Users, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTNERS = [
    'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
    'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
    'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

const PICKUP_LOCATIONS = [
    'Ercan International Airport', 'Larnaca International Airport', 'Paphos Airport',
    'Girne (Kyrenia) City Centre', 'Lefkoşa (Nicosia) City Centre', 'Gazimağusa (Famagusta) City Centre',
    'İskele (Trikomo)', 'Güzelyurt (Morphou)', 'Bafra Resort Area', 'Long Beach Area',
];

const DROPOFF_LOCATIONS = [
    'Ercan International Airport', 'Larnaca International Airport', 'Paphos Airport',
    'Girne (Kyrenia) City Centre', 'Lefkoşa (Nicosia) City Centre', 'Gazimağusa (Famagusta) City Centre',
    'İskele (Trikomo)', 'Güzelyurt (Morphou)', 'Bafra Resort Area', 'Long Beach Area',
    'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
    'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
    'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

const VEHICLE_TYPES = ['VIP Business Van', 'Executive Sedan', 'Luxury Minibus', 'First Class Sedan', 'Premium SUV'];
const TRANSFER_TYPES = ['Airport Transfer', 'Point to Point', 'Hourly Chauffeur', 'Intercity Ride', 'Event Logistics'];
const GUEST_TYPES = ['Individual VIP', 'Corporate Agency', 'Hotel Guest'];
const STATUSES = ['Confirmed', 'In Transit', 'Completed', 'Cancelled'];
const PAX_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
const EMPTY = {
    firstName: '', lastName: '', email: '', phone: '',
    company: '', customerType: '', vehicleType: '', transferType: '',
    pickupLocation: '', dropoffLocation: '', transferDate: '', transferTime: '',
    flightNumber: '', passengers: '', notes: '', status: '',
};
type Form = typeof EMPTY;

// ─── Status Badge Style ───────────────────────────────────────────────────────

const statusStyle = (status: string) => {
    switch (status) {
        case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'In Transit': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
};

// ─── Form Field Wrapper ───────────────────────────────────────────────────────

const F = ({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) => (
    <div className={`flex flex-col gap-1.5 w-full${span2 ? ' md:col-span-2' : ''}`}>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const formatDisplayDate = (d: string) => {
    if (!d) return '';
    if (d.includes('-')) {
        const [y, m, day] = d.split('-');
        if (y && m && day && y.length === 4) return `${day}/${m}/${y}`; // Convert old YYYY-MM-DD to DD/MM/YYYY
    }
    return d;
};

// ─── Section Divider ──────────────────────────────────────────────────────────

const Section = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="md:col-span-2 flex items-center gap-3 pt-2 mt-1">
        <div className="flex items-center gap-2 text-[#aa2d29]">{icon}</div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);


// ─── Customer Form ────────────────────────────────────────────────────────────

function CustomerForm({ value: v, onChange: set, onSave, onCancel, saveLabel }: {
    value: Form; onChange: (k: string, val: string) => void;
    onSave: () => void; onCancel: () => void; saveLabel: string;
}) {
    const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400";
    const sel = (key: keyof Form, opts: string[], placeholder: string) => (
        <Select value={v[key]} onValueChange={val => set(key, val || '')}>
            <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>{opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectGroup>
            </SelectContent>
        </Select>
    );
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Section icon={<User className="w-4 h-4" />} title="Guest Information" />
            <F label="First Name"><input type="text" placeholder="e.g. James" value={v.firstName} onChange={e => set('firstName', e.target.value)} className={inp} /></F>
            <F label="Last Name"><input type="text" placeholder="e.g. Robertson" value={v.lastName} onChange={e => set('lastName', e.target.value)} className={inp} /></F>
            <F label="Email Address"><input type="email" placeholder="guest@example.com" value={v.email} onChange={e => set('email', e.target.value)} className={inp} /></F>
            <F label="Phone Number"><input type="text" placeholder="+44 7700 000000" value={v.phone} onChange={e => set('phone', e.target.value)} className={inp} /></F>

            <Section icon={<Building2 className="w-4 h-4" />} title="Booking Details" />
            <F label="Guest Type">{sel('customerType', GUEST_TYPES, 'Select guest type')}</F>
            <F label="B2B Partner (Hotel / Agency)">{sel('company', PARTNERS, 'Select partner or leave blank')}</F>
            <F label="Status">{sel('status', STATUSES, 'Select status')}</F>
            <F label="Passengers">{sel('passengers', PAX_OPTIONS, 'No. of passengers')}</F>

            <Section icon={<Car className="w-4 h-4" />} title="Transfer Details" />
            <F label="Transfer Type">{sel('transferType', TRANSFER_TYPES, 'Select transfer type')}</F>
            <F label="Vehicle Type">{sel('vehicleType', VEHICLE_TYPES, 'Select vehicle')}</F>
            <F label="Transfer Date">
                <input 
                    type="text" 
                    placeholder="DD/MM/YYYY" 
                    value={formatDisplayDate(v.transferDate)} 
                    onChange={e => set('transferDate', e.target.value)} 
                    className={inp} 
                />
            </F>
            <F label="Transfer Time">
                <input 
                    type="text" 
                    placeholder="HH:MM" 
                    value={v.transferTime} 
                    onChange={e => set('transferTime', e.target.value)} 
                    className={inp} 
                />
            </F>

            <Section icon={<MapPin className="w-4 h-4" />} title="Route" />
            <F label="Pick-up Location">{sel('pickupLocation', PICKUP_LOCATIONS, 'Select pick-up point')}</F>
            <F label="Drop-off Location">{sel('dropoffLocation', DROPOFF_LOCATIONS, 'Select drop-off point')}</F>
            <F label="Flight Number">
                <div className="relative">
                    <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="e.g. TK 960, PC 1932" value={v.flightNumber} onChange={e => set('flightNumber', e.target.value)} className={inp + " pl-10"} />
                </div>
            </F>

            <Section icon={<Info className="w-4 h-4" />} title="Additional Notes" />
            <F label="Special Requests / Notes" span2>
                <textarea placeholder="e.g. Baby seat required, champagne on arrival, meet & greet with name board..." value={v.notes} onChange={e => set('notes', e.target.value)}
                    className={inp + " resize-none h-20"} />
            </F>

            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                <button onClick={onCancel} className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={onSave} className="bg-[#aa2d29] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#8e2622] transition-colors shadow-sm">{saveLabel}</button>
            </div>
        </div>
    );
}
// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Remove VIP Guest</h3>
                <p className="text-sm text-gray-500 mb-6">You are about to permanently remove <span className="font-semibold text-gray-800">{name}</span> from the system. This cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-5 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">Remove</button>
                </div>
            </div>
        </div>
    );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ c, onClose }: { c: any; onClose: () => void }) {
    const fullName = c.firstName ? `${c.firstName} ${c.lastName}` : c.name;
    const sections = [
        {
            icon: <User className="w-3.5 h-3.5" />, title: 'Guest',
            fields: [['Full Name', fullName], ['Email', c.email], ['Phone', c.phone], ['Guest Type', c.customerType]]
        },
        {
            icon: <Building2 className="w-3.5 h-3.5" />, title: 'Booking',
            fields: [
                ['B2B Partner', c.company], ['Status', c.status],
                ['Passengers', c.passengers ? `${c.passengers} pax` : null],
                ['Booked On', c.createdAt || (c.id ? new Date(c.id).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null)],
            ]
        },
        {
            icon: <Car className="w-3.5 h-3.5" />, title: 'Transfer',
            fields: [['Vehicle', c.vehicleType], ['Type', c.transferType], ['Date', formatDisplayDate(c.transferDate)], ['Time', c.transferTime]]
        },
        {
            icon: <MapPin className="w-3.5 h-3.5" />, title: 'Route',
            fields: [['Pick-up', c.pickupLocation], ['Drop-off', c.dropoffLocation], ['Flight No.', c.flightNumber]]
        },
    ];
    return (
        <tr>
            <td colSpan={5} className="px-6 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100">
                <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#aa2d29]/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#aa2d29]">{(c.firstName?.[0] || c.name?.[0] || '?').toUpperCase()}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{fullName}</p>
                        {c.status && <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle(c.status)}`}>{c.status}</span>}
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {sections.map(s => (
                        <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-3">
                                <span className="text-[#aa2d29]">{s.icon}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.title}</span>
                            </div>
                            <div className="space-y-2">
                                {s.fields.filter(([, v]) => v).map(([label, val]) => (
                                    <div key={label as string}>
                                        <p className="text-[10px] text-gray-400 font-medium">{label as string}</p>
                                        <p className="text-sm text-gray-800 font-semibold leading-tight">{val as string}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {c.notes && (
                    <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Special Requests</p>
                        <p className="text-sm text-gray-700">{c.notes}</p>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ ...EMPTY });
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ ...EMPTY });
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [detailId, setDetailId] = useState<number | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean | null>(null);

    useEffect(() => {
        setCustomers(JSON.parse(localStorage.getItem('customersDB') || '[]'));
    }, []);

    const persist = (list: any[]) => { setCustomers(list); localStorage.setItem('customersDB', JSON.stringify(list)); };
    const setF = (form: any, setForm: (f: any) => void) => (k: string, val: string) => setForm((p: any) => ({ ...p, [k]: val }));

    const handleAdd = () => {
        if (!addForm.firstName || !addForm.lastName) return;
        const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        persist([...customers, { ...addForm, id: Date.now(), createdAt: today }]);
        setAddForm({ ...EMPTY }); setShowAdd(false);
    };

    const startEdit = (c: any) => {
        if (editId === c.id) { setEditId(null); return; }
        setEditId(c.id); setEditForm({ ...EMPTY, ...c }); setDetailId(null); setShowAdd(false);
    };

    const handleEditSave = () => {
        if (!editForm.firstName || !editForm.lastName) return;
        persist(customers.map(c => c.id === editId ? { ...editForm, id: editId } : c));
        setEditId(null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        persist(customers.filter(c => c.id !== deleteTarget.id));
        if (editId === deleteTarget.id) setEditId(null);
        if (detailId === deleteTarget.id) setDetailId(null);
        setDeleteTarget(null);
    };

    const fullName = (c: any) => c.firstName ? `${c.firstName} ${c.lastName}` : c.name;
    const filtered = customers.filter(c => {
        const name = fullName(c) || '';
        const q = searchTerm.toLowerCase();
        return name.toLowerCase().includes(q)
            || (c.company && c.company.toLowerCase().includes(q))
            || (c.email && c.email.toLowerCase().includes(q))
            || (c.flightNumber && c.flightNumber.toLowerCase().includes(q))
            || (c.pickupLocation && c.pickupLocation.toLowerCase().includes(q));
    }).sort((a, b) => {
        if (sortAsc === null) return 0;
        const na = fullName(a)?.toLowerCase() ?? '';
        const nb = fullName(b)?.toLowerCase() ?? '';
        return sortAsc ? na.localeCompare(nb) : nb.localeCompare(na);
    });

    return (
        <div className="pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl text-gray-900 font-bold tracking-tight">VIP Guests</h2>
                    <p className="text-gray-500 mt-1 text-base">Manage reservations, transfers and guest profiles.</p>
                </div>
                <button onClick={() => { setShowAdd(true); setEditId(null); }}
                    className="bg-[#aa2d29] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#8e2622] active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-[#aa2d29]/20">
                    <Plus className="w-5 h-5" /><span>New Reservation</span>
                </button>
            </div>

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-7 border-b border-gray-100 pb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">New Reservation</h3>
                                <p className="text-sm text-gray-500 mt-1">Complete the form to log a new VIP transfer booking.</p>
                            </div>
                            <button onClick={() => {
                                setShowAdd(false); setAddForm({ ...EMPTY });
                            }} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <CustomerForm value={addForm} onChange={setF(addForm, setAddForm)} onSave={handleAdd}
                            onCancel={() => { setShowAdd(false); setAddForm({ ...EMPTY }); }} saveLabel="Create Reservation" />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name, flight no., partner, pick-up location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all" />
                    </div>
                    <span className="text-sm text-gray-400 font-medium whitespace-nowrap">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3.5 px-6">
                                    <button onClick={() => setSortAsc(p => p === true ? false : p === false ? null : true)}
                                        className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group">
                                        <span>Guest</span>
                                        <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                                            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${sortAsc === true ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                                            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${sortAsc === false ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                                        </span>
                                    </button>
                                </th>
                                <th className="py-3.5 px-6">Transfer</th>
                                <th className="py-3.5 px-6">Route & Date</th>
                                <th className="py-3.5 px-6 text-center">Status</th>
                                <th className="py-3.5 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {filtered.map(c => (
                                <React.Fragment key={c.id}>
                                    <tr className="hover:bg-gray-50/60 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#aa2d29]/10 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-[#aa2d29]">{(c.firstName?.[0] || c.name?.[0] || '?').toUpperCase()}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-tight">{fullName(c)}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{c.customerType || '—'}{c.company ? ` · ${c.company}` : ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-800">{c.transferType || '—'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{c.vehicleType || ''}{c.passengers ? ` · ${c.passengers} pax` : ''}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            {(c.pickupLocation || c.dropoffLocation) ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />{c.pickupLocation || '—'}</p>
                                                    <p className="text-xs text-gray-400 pl-3.5">{c.dropoffLocation || '—'}</p>
                                                </div>
                                            ) : <span className="text-gray-400">—</span>}
                                            {c.transferDate && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3 shrink-0" />{formatDisplayDate(c.transferDate)}{c.transferTime ? ` at ${c.transferTime}` : ''}</p>}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(c.status)}`}>{c.status || '—'}</span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => { setDetailId(p => p === c.id ? null : c.id); setEditId(null); }} title="View Details"
                                                    className={`p-1.5 rounded-lg transition-colors ${detailId === c.id ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}><Info className="w-4 h-4" /></button>
                                                <button onClick={() => startEdit(c)} title="Edit"
                                                    className={`p-1.5 rounded-lg transition-colors ${editId === c.id ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-400 hover:bg-[#aa2d29]/10 hover:text-[#aa2d29]'}`}><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => setDeleteTarget(c)} title="Remove"
                                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {detailId === c.id && <DetailPanel key={`d-${c.id}`} c={c} onClose={() => setDetailId(null)} />}
                                </React.Fragment>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No VIP guests found.</p>
                                        <p className="text-gray-400 text-sm">Start by adding a new reservation.</p>
                                    </div>
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {editId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-7 border-b border-gray-100 pb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Edit VIP Guest</h3>
                                <p className="text-sm text-gray-500 mt-1">Update the details below and save your changes.</p>
                            </div>
                            <button onClick={() => setEditId(null)} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <CustomerForm value={editForm} onChange={setF(editForm, setEditForm)} onSave={handleEditSave} onCancel={() => setEditId(null)} saveLabel="Save Changes" />
                    </div>
                </div>
            )}
            {deleteTarget && <ConfirmModal name={fullName(deleteTarget)} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
        </div>
    );
}