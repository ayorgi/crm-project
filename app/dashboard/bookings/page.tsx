/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Info, Pencil, Trash2, X, Car, User, Calendar, MapPin, Plane, Users, Building2, Copy, ChevronDown, Clock, CheckCircle2, PlusCircle, CreditCard, Sparkles, MessageSquare, ShieldCheck, Thermometer, VolumeX, Baby, Tag } from 'lucide-react';


import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { apiFetch, transformBackendCustomers } from '@/lib/api';
import { isAirport } from '@/lib/bookingUtils';
import { 
    PARTNERS, 
    LOCATION_GROUPS, 
    VEHICLE_TYPES, 
    TRANSFER_TYPES, 
    GUEST_TYPES, 
    STATUSES, 
    PAX_OPTIONS 
} from '@/lib/constants';


// ─── Constants ────────────────────────────────────────────────────────────────

// Constants imported from lib/constants
const EMPTY = {
    firstName: '', lastName: '', email: '', phone: '',
    company: '', customerType: 'Individual VIP', vehicleType: '', transferType: '',
    pickupLocation: '', dropoffLocation: '', transferDate: '', transferTime: '',
    flightNumber: '', passengers: '', notes: '', status: 'Confirmed',
};
type Form = typeof EMPTY;

// ─── Status Badge Style ───────────────────────────────────────────────────────

const statusStyle = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
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

function CustomerForm({ value: v, onChange: onChangeProp, onSave, onCancel, saveLabel }: {
    value: Form; onChange: (k: string, val: string) => void;
    onSave: () => void; onCancel: () => void; saveLabel: string;
}) {
    const set = (key: string, val: string) => {
        onChangeProp(key, val);
        if (key === 'company') {
            onChangeProp('customerType', val && val !== 'none' ? 'B2B Partner' : 'Individual VIP');
        }
        if (key === 'transferType' && val !== 'Airport Transfer') {
            onChangeProp('flightNumber', '');
        }
    };
    const dateInputRef = React.useRef<HTMLInputElement>(null);
    const timeInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const hasAirport = isAirport(v.pickupLocation || '') || isAirport(v.dropoffLocation || '');
        if (hasAirport && v.transferType !== 'Airport Transfer') {
            onChangeProp('transferType', 'Airport Transfer');
        } else if (!hasAirport && v.transferType === 'Airport Transfer') {
            onChangeProp('transferType', '');
        }
        if (!hasAirport && v.flightNumber) {
            onChangeProp('flightNumber', '');
        }
    }, [v.pickupLocation, v.dropoffLocation]);

    const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400";
    const sel = (key: keyof Form, opts: string[], placeholder: string) => (
        <Select value={v[key]} onValueChange={val => set(key, val === 'none' || !val ? '' : val)}>
            <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                    {opts.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectGroup>
            </SelectContent>
        </Select>
    );

    const locationSel = (key: keyof Form, placeholder: string) => (
        <Select value={v[key]} onValueChange={val => set(key, val === 'none' || !val ? '' : val)}>
            <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                {LOCATION_GROUPS.map((group, i) => (
                    <SelectGroup key={group.label}>
                        {i > 0 && <SelectSeparator />}
                        <SelectLabel className="font-bold text-[11px] text-gray-500 uppercase tracking-widest bg-gray-50/50 px-2 py-1.5">{group.label}</SelectLabel>
                        {group.items.map(o => <SelectItem key={o} value={o} className="pl-4">{o}</SelectItem>)}
                    </SelectGroup>
                ))}
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
            <F label="Guest Type">
                <input
                    className={inp + " bg-gray-100/80 text-gray-500 font-semibold cursor-not-allowed"}
                    value={v.customerType}
                    readOnly
                    title="Auto-calculated based on B2B Partner"
                />
            </F>
            <F label="B2B Partner (Hotel / Agency)">{sel('company', PARTNERS, 'Select partner or leave blank')}</F>
            <F label="Status">{sel('status', STATUSES, 'Select status')}</F>
            <F label="Passengers">{sel('passengers', PAX_OPTIONS, 'Select # of passengers')}</F>

            <Section icon={<Car className="w-4 h-4" />} title="Transfer Details" />
            <F label="Transfer Type">
                <Select
                    value={v.transferType}
                    onValueChange={val => set('transferType', val === 'none' || !val ? '' : val)}
                    disabled={isAirport(v.pickupLocation || '') || isAirport(v.dropoffLocation || '')}
                >
                    <SelectTrigger className={`${inp} ${isAirport(v.pickupLocation || '') || isAirport(v.dropoffLocation || '') ? 'opacity-80 bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-gray-50'}`}>
                        <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                        {TRANSFER_TYPES.map(o => (
                            <SelectItem 
                                key={o} 
                                value={o}
                                disabled={o === 'Airport Transfer' && !isAirport(v.pickupLocation || '') && !isAirport(v.dropoffLocation || '')}
                                className={o === 'Airport Transfer' && !isAirport(v.pickupLocation || '') && !isAirport(v.dropoffLocation || '') ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                {o}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </F>
            <F label="Vehicle Type">{sel('vehicleType', VEHICLE_TYPES, 'Select vehicle')}</F>
            <F label="Transfer Date">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="DD/MM/YYYY"
                        value={formatDisplayDate(v.transferDate)}
                        readOnly
                        onClick={() => { try { dateInputRef.current?.showPicker(); } catch (e) {} }}
                        className={`${inp} pr-10 cursor-pointer`}
                    />
                    <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        ref={dateInputRef}
                        type="date"
                        value={v.transferDate}
                        onChange={e => set('transferDate', e.target.value)}
                        className="sr-only"
                    />
                </div>
            </F>
            <F label="Transfer Time">
                <Select value={v.transferTime} onValueChange={val => set('transferTime', val || '')}>
                    <SelectTrigger className="w-full h-10 bg-[#fafafa] border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29]">
                        <SelectValue placeholder="Select transfer time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                        {Array.from({ length: 96 }, (_, i) => {
                            const hours = String(Math.floor(i / 4)).padStart(2, '0');
                            const minutes = String((i % 4) * 15).padStart(2, '0');
                            const value = `${hours}:${minutes}`;
                            return (
                                <SelectItem key={value} value={value}>
                                    {value}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </F>


            <Section icon={<MapPin className="w-4 h-4" />} title="Route" />
            <F label="Pick-up Location">{locationSel('pickupLocation', 'Select pick-up point')}</F>
            <F label="Drop-off Location">{locationSel('dropoffLocation', 'Select drop-off point')}</F>
            {v.transferType === 'Airport Transfer' ? (
                <F label="Flight Number">
                    <div className="relative">
                        <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="e.g. TK 960, PC 1932" value={v.flightNumber} onChange={e => set('flightNumber', e.target.value)} className={inp + " pl-10"} />
                    </div>
                </F>
            ) : (
                <F label="Flight Number">
                    <div className="relative">
                        <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input type="text" placeholder="Not applicable for this transfer type" value="" disabled className={inp + " pl-10 bg-gray-100/80 text-gray-400 cursor-not-allowed"} />
                    </div>
                </F>
            )}

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
                <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Booking</h3>
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

// Helper to parse structured booking notes
function parseBookingNotes(rawNotes?: string) {
    if (!rawNotes) return { payment: null, fare: null, tip: null, preferences: null, specialRequests: null };

    if (!rawNotes.includes('[')) {
        return {
            payment: null,
            fare: null,
            tip: null,
            preferences: null,
            specialRequests: rawNotes.trim(),
        };
    }

    const paymentMatch = rawNotes.match(/\[Payment:\s*([^\]]+)\]/i);
    const fareMatch = rawNotes.match(/\[Fare:\s*([^\]]+)\]/i);
    const tipMatch = rawNotes.match(/\[Tip:\s*([^\]]+)\]/i);
    const quietMatch = rawNotes.match(/\[Quiet Ride:\s*([^\]]+)\]/i);
    const climateMatch = rawNotes.match(/\[Climate:\s*([^\]]+)\]/i);
    const childSeatMatch = rawNotes.match(/\[Child Seat:\s*([^\]]+)\]/i);
    const meetSignMatch = rawNotes.match(/\[Meet Sign:\s*([^\]]+)\]/i);

    let customNotes = '';
    const notesIndex = rawNotes.indexOf('Notes:');
    if (notesIndex !== -1) {
        customNotes = rawNotes.substring(notesIndex + 6).trim();
    } else {
        const stripped = rawNotes.replace(/\[[^\]]+\]/g, '').trim();
        if (stripped) customNotes = stripped;
    }

    const hasPreferences = quietMatch || climateMatch || childSeatMatch || meetSignMatch;
    const preferences = hasPreferences ? {
        quietRide: quietMatch ? quietMatch[1].trim() : null,
        climate: climateMatch ? climateMatch[1].trim() : null,
        childSeat: childSeatMatch ? childSeatMatch[1].trim() : null,
        meetSign: meetSignMatch ? meetSignMatch[1].trim() : null,
    } : null;

    const numFare = fareMatch ? parseFloat(fareMatch[1].replace(/[^0-9.]/g, '')) : 0;
    const numTip = tipMatch ? parseFloat(tipMatch[1].replace(/[^0-9.]/g, '')) : 0;
    const computedTotal = (numFare > 0 || numTip > 0) ? (numFare + numTip).toFixed(2) : null;

    return {
        payment: paymentMatch ? paymentMatch[1].trim() : null,
        fare: fareMatch ? fareMatch[1].trim() : null,
        tip: tipMatch ? tipMatch[1].trim() : null,
        total: computedTotal,
        preferences,
        specialRequests: customNotes || null,
    };
}

function DetailPanel({ c, onClose, onDuplicate }: { c: any; onClose: () => void; onDuplicate: () => void }) {
    const fullName = c.firstName ? `${c.firstName} ${c.lastName}` : c.name;
    const hasTransfer = !!c.transferType;
    const parsedNotes = parseBookingNotes(c.notes);
    const displayTotal = parsedNotes.total || (c.price ? Number(c.price).toFixed(2) : null) || (parsedNotes.fare ? parsedNotes.fare.replace('$', '') : '0.00');

    const allSections = [
        {
            icon: <User className="w-3.5 h-3.5" />, title: 'Guest',
            fields: [['Full Name', fullName], ['Email', c.email], ['Phone', c.phone], ['Guest Type', c.customerType]]
        },
        ...(hasTransfer ? [
            {
                icon: <Building2 className="w-3.5 h-3.5" />, title: 'Booking',
                fields: [
                    ['B2B Partner', c.company], ['Status', c.status],
                    ['Passengers', c.passengers ? `${c.passengers} pax` : null],
                    ['Booked On', formatDisplayDate(c.createdAt) || c.createdAt || null],
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
        ] : []),
    ];
    const sections = allSections;
    return (
        <tr>
            <td colSpan={5} className="px-6 py-5 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100 space-y-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reservation Details</span>
                    <div className="flex items-center gap-1">
                        <button onClick={onDuplicate} title="Duplicate Guest" className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Copy className="w-4 h-4" /></button>
                        <button onClick={onClose} title="Close" className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className={`grid gap-4 ${sections.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-2 lg:grid-cols-4'}`}>
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

                {/* Structured Payment & Gratuity Card */}
                {(parsedNotes.payment || parsedNotes.fare || parsedNotes.tip || c.price) && (
                    <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Payment & Billing</span>
                                <p className="text-xs font-semibold text-gray-800">
                                    {parsedNotes.payment || 'Direct Settlement'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                            {parsedNotes.fare && (
                                <div>
                                    <span className="text-gray-400 text-[10px] block font-medium">Base Fare</span>
                                    <span className="font-bold text-gray-800">{parsedNotes.fare}</span>
                                </div>
                            )}
                            {parsedNotes.tip && (
                                <div>
                                    <span className="text-gray-400 text-[10px] block font-medium">Chauffeur Tip</span>
                                    <span className="font-bold text-emerald-700">{parsedNotes.tip}</span>
                                </div>
                            )}
                            {(parsedNotes.total || c.price || parsedNotes.fare) && (
                                <div className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-right">
                                    <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Total</span>
                                    <span className="font-black text-sm text-white">${displayTotal}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* VIP Cabin Preferences */}
                {parsedNotes.preferences && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#aa2d29]" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">VIP Cabin Preferences</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {parsedNotes.preferences.quietRide && (
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                                    <span className="text-[10px] text-slate-400 font-medium block">Quiet Ride</span>
                                    <span className="font-bold text-slate-800">{parsedNotes.preferences.quietRide}</span>
                                </div>
                            )}
                            {parsedNotes.preferences.climate && (
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                                    <span className="text-[10px] text-slate-400 font-medium block">Cabin Climate</span>
                                    <span className="font-bold text-slate-800">{parsedNotes.preferences.climate}</span>
                                </div>
                            )}
                            {parsedNotes.preferences.childSeat && (
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                                    <span className="text-[10px] text-slate-400 font-medium block">Child / Baby Seat</span>
                                    <span className="font-bold text-slate-800">{parsedNotes.preferences.childSeat}</span>
                                </div>
                            )}
                            {parsedNotes.preferences.meetSign && (
                                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
                                    <span className="text-[10px] text-slate-400 font-medium block">Meet & Greet Sign</span>
                                    <span className="font-bold text-slate-800">{parsedNotes.preferences.meetSign}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Genuine Special Requests / Custom Notes only */}
                {parsedNotes.specialRequests && (
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1">
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Special Requests & Refreshments</p>
                        </div>
                        <p className="text-sm font-medium text-amber-950 leading-relaxed">{parsedNotes.specialRequests}</p>
                    </div>
                )}
            </td>
        </tr>
    );
}

export default function BookingsPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [addForm, setAddForm] = useState({ ...EMPTY });
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ ...EMPTY });
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [detailId, setDetailId] = useState<number | null>(null);
    const [sortField, setSortField] = useState<'name' | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [statusFilter, setStatusFilter] = useState('All');
    const [visibleCount, setVisibleCount] = useState(10);
    const [toast, setToast] = useState<{ message: string; subtext?: string } | null>(null);

    const showToast = (message: string, subtext = 'All updates have been synced') => {
        setToast({ message, subtext });
        setTimeout(() => setToast(null), 3500);
    };


    const statusTabs = ['All', 'Confirmed', 'Pending', 'In Transit', 'Completed', 'Cancelled'];

    useEffect(() => {
        apiFetch('/customers')
            .then((res) => res.json())
            .then((result) => {
                if (result.status === 'success' && Array.isArray(result.data)) {
                    const backendCustomers = transformBackendCustomers(result.data);
                    setCustomers(backendCustomers);
                    localStorage.setItem('customersDB', JSON.stringify(backendCustomers));
                } else {
                    const local = JSON.parse(localStorage.getItem('customersDB') || '[]');
                    setCustomers(local);
                }
            })
            .catch((err) => {
                console.error('Error fetching customers from API, fallback to localStorage:', err);
                const local = JSON.parse(localStorage.getItem('customersDB') || '[]');
                setCustomers(local);
            });
    }, []);

    const setF = (form: any, setForm: (f: any) => void) => (k: string, val: string) => setForm((p: any) => ({ ...p, [k]: val }));

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
            body: JSON.stringify(payload)
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
        if (editId === c.id) { setEditId(null); return; }
        setEditId(c.id); setEditForm({ ...EMPTY, ...c }); setDetailId(null); setShowAdd(false);
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

        const realId = editId ? editId.toString().split('-')[0] : '';

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
        };

        apiFetch(`/customers/${realId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 'success' && result.data) {
                    const transformedEdit = transformBackendCustomers([result.data]);
                    const newItem = transformedEdit.find(x => x.id === editId) || transformedEdit[0] || editForm;
                    const updated = customers.map(c => c.id === editId ? { ...c, ...newItem, id: editId } : c);
                    setCustomers(updated);
                    localStorage.setItem('customersDB', JSON.stringify(updated));

                    setEditId(null);
                    showToast('Changes saved successfully!', 'Guest profile & transfer details updated');
                }
            })
            .catch(err => console.error('Error updating customer in Laravel API:', err));
    };
    const confirmDelete = () => {

        if (!deleteTarget) return;

        const realId = deleteTarget.id ? deleteTarget.id.toString().split('-')[0] : '';

        apiFetch(`/customers/${realId}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 'success') {
                    setCustomers(customers.filter(c => c.id !== deleteTarget.id));
                    if (editId === deleteTarget.id) setEditId(null);
                    setDeleteTarget(null);
                }
            })
            .catch(err => console.error('Error deleting customer in Laravel API:', err));
    };


    const handleSort = (field: 'name') => {
        if (sortField !== field) {
            setSortField(field);
            setSortDir('asc');
        } else if (sortDir === 'asc') {
            setSortDir('desc');
        } else {
            setSortField(null);
        }
    };

    const handleStatusChange = (id: any, newStatus: string) => {
        const updated = customers.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCustomers(updated);
        localStorage.setItem('customersDB', JSON.stringify(updated));

        const realId = id ? id.toString().split('-')[0] : '';
        if (realId) {
            apiFetch(`/customers/${realId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            }).catch(err => console.error('Error updating status in backend:', err));
        }
    };

    const fullName = (c: any) => c.firstName ? `${c.firstName} ${c.lastName}` : c.name;

    const filtered = customers.filter(c => {
        const name = fullName(c) || '';
        const q = searchTerm.toLowerCase();
        const matchesSearch = name.toLowerCase().includes(q)
            || (c.company && c.company.toLowerCase().includes(q))
            || (c.email && c.email.toLowerCase().includes(q))
            || (c.flightNumber && c.flightNumber.toLowerCase().includes(q))
            || (c.pickupLocation && c.pickupLocation.toLowerCase().includes(q));
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (!sortField) return 0;
        if (sortField === 'name') {
            const na = fullName(a)?.toLowerCase() ?? '';
            const nb = fullName(b)?.toLowerCase() ?? '';
            const cmp = na.localeCompare(nb);
            return sortDir === 'asc' ? cmp : -cmp;
        }
        return 0;
    });



    return (
        <div className="pb-10 pt-2">

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-7 border-b border-gray-50 pb-5">
                            <div>
                                <h3 className="text-2xl font-heading font-bold text-gray-900">{isDuplicate ? 'Duplicate Guest' : 'New Reservation'}</h3>
                                <p className="text-sm text-gray-500 mt-1">{isDuplicate ? 'Review and edit the details for this duplicated booking.' : 'Complete the form to log a new VIP transfer booking.'}</p>
                            </div>
                            <button onClick={() => {
                                setShowAdd(false); setAddForm({ ...EMPTY });
                            }} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <CustomerForm value={addForm} onChange={setF(addForm, setAddForm)} onSave={handleAdd}
                            onCancel={() => { setShowAdd(false); setAddForm({ ...EMPTY }); }} saveLabel={isDuplicate ? 'Save Duplicate' : 'Create Reservation'} />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-soft border border-gray-100/80 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name, flight no., partner, pick-up location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50/60 border border-gray-200/80 rounded-xl text-sm focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400" />
                    </div>
                    <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                        {statusTabs.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    statusFilter === s ? 'bg-[#aa2d29] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { setIsDuplicate(false); setAddForm({ ...EMPTY }); setShowAdd(true); }}
                        className="hidden md:flex items-center justify-center gap-2 bg-[#aa2d29] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#8e2622] transition-colors shadow-sm shrink-0"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>New Reservation</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/70">
                                <th className="py-3.5 px-6 w-3/12">
                                    <button onClick={() => handleSort('name')}
                                        className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group">
                                        <span>GUESTS</span>
                                        <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                                            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${sortField === 'name' && sortDir === 'asc' ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                                            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${sortField === 'name' && sortDir === 'desc' ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                                        </span>
                                    </button>
                                </th>
                                <th className="py-3.5 px-6 w-3/12">TRANSFER</th>
                                <th className="py-3.5 px-6 w-4/12">ROUTE & DATE</th>
                                <th className="py-3.5 px-6 w-1/12 text-center">STATUS</th>
                                <th className="py-3.5 px-6 w-1/12 text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {filtered.slice(0, visibleCount).map(c => (
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
                                            {!c.transferType ? (
                                                <span className="text-gray-300 text-sm">—</span>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-800">{c.transferType || '—'}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{c.vehicleType || ''}{c.passengers ? ` · ${c.passengers} pax` : ''}</p>
                                                </>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {!c.transferType ? (
                                                <span className="text-gray-300 text-sm">—</span>
                                            ) : (
                                                <>
                                                    {(c.pickupLocation || c.dropoffLocation) ? (
                                                        <div className="flex flex-col gap-0.5">
                                                            <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />{c.pickupLocation || '—'}</p>
                                                            <p className="text-xs text-gray-400 pl-3.5">{c.dropoffLocation || '—'}</p>
                                                        </div>
                                                    ) : <span className="text-gray-400">—</span>}
                                                    {c.transferDate && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3 shrink-0" />{formatDisplayDate(c.transferDate)}{c.transferTime ? ` at ${c.transferTime}` : ''}</p>}
                                                </>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {c.status === 'New' || !c.transferType ? (
                                                <span className="text-gray-400">—</span>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(c.status)}`}>{c.status || '—'}</span>
                                            )}
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
                                    {detailId === c.id && <DetailPanel key={`d-${c.id}`} c={c} onClose={() => setDetailId(null)} onDuplicate={() => startDuplicate(c)} />}
                                </React.Fragment>
                            ))}
                            {filtered.length === 0 && (() => {
                                const emptyText = searchTerm.trim() ? {
                                    title: `No results found for "${searchTerm}"`,
                                    subtitle: "Try searching for a different guest name, partner, location, or flight number."
                                } : statusFilter === 'In Transit' ? {
                                    title: "No active transfers in transit",
                                    subtitle: "There are currently no VIP guests in transit at this moment."
                                } : statusFilter === 'Confirmed' ? {
                                    title: "No confirmed reservations found",
                                    subtitle: "There are no upcoming confirmed transfers matching your filter."
                                } : statusFilter === 'Pending' ? {
                                    title: "No pending bookings found",
                                    subtitle: "All guest reservations have been processed and confirmed."
                                } : statusFilter === 'Completed' ? {
                                    title: "No completed transfers found",
                                    subtitle: "Completed VIP trips will appear here."
                                } : statusFilter === 'Cancelled' ? {
                                    title: "No cancelled bookings",
                                    subtitle: "There are no cancelled reservations in the system."
                                } : {
                                    title: "No VIP guests found",
                                    subtitle: "Start by adding a new reservation."
                                };

                                return (
                                    <tr><td colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-full bg-gray-100/80 border border-gray-200/50 flex items-center justify-center mb-1">
                                                <Users className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-gray-800 font-bold text-base">{emptyText.title}</p>
                                            <p className="text-gray-400 text-xs max-w-sm mx-auto">{emptyText.subtitle}</p>
                                        </div>
                                    </td></tr>
                                );
                            })()}

                        </tbody>
                    </table>
                </div>
                {filtered.length > visibleCount && (
                    <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 10)}
                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group"
                        >
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            Show More (+{filtered.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>
            {editId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-7 border-b border-gray-100 pb-5">
                            <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Booking</h3>
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

            {toast && (
                <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3.5 bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white leading-tight">{toast.message}</p>
                        {toast.subtext && <p className="text-xs text-gray-400 mt-0.5">{toast.subtext}</p>}
                    </div>
                    <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}