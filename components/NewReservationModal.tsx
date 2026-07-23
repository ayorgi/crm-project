/* eslint-disable */
'use client';
import React, { useState } from 'react';
import { X, Car, User, MapPin, Plane, Building2, Info } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectSeparator } from '@/components/ui/select';

const PARTNERS = [
    'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
    'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
    'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

const LOCATION_GROUPS = [
    {
        label: 'Airports',
        items: ['Ercan International Airport', 'Larnaca International Airport', 'Paphos Airport'].sort()
    },
    {
        label: 'Cities & Regions',
        items: [
            'Bafra Resort Area', 'Gazimağusa (Famagusta) City Centre', 'Girne (Kyrenia) City Centre',
            'Güzelyurt (Morphou)', 'İskele (Trikomo)', 'Lefkoşa (Nicosia) City Centre', 'Long Beach Area'
        ].sort()
    },
    {
        label: 'Hotels & Resorts',
        items: [
            'Acapulco Resort', 'Arkın Iskele Hotel', 'Concorde Luxury Resort', 'Cratos Premium Hotel',
            'Elexus Hotel Resort', 'Kaya Palazzo Resort', 'Les Ambassadeurs', 'Limak Cyprus Deluxe',
            "Lord's Palace Hotel", 'Merit Royal Diamond'
        ].sort()
    }
];

const VEHICLE_TYPES = ['VIP Business Van', 'Executive Sedan', 'Premium SUV', 'First Class Sedan'];
const TRANSFER_TYPES = ['Airport Transfer', 'Point to Point', 'Hourly Chauffeur', 'Intercity Ride', 'Event Logistics'];
const GUEST_TYPES = ['Individual VIP', 'Corporate Agency'];
const STATUSES = ['Pending', 'Confirmed', 'In Transit', 'Completed', 'Cancelled'];
const PAX_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

const EMPTY = {
    firstName: '', lastName: '', email: '', phone: '',
    company: '', customerType: '', vehicleType: '', transferType: '',
    pickupLocation: '', dropoffLocation: '', transferDate: '', transferTime: '',
    flightNumber: '', passengers: '', notes: '', status: 'Confirmed',
};

type Form = typeof EMPTY;

const F = ({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) => (
    <div className={`flex flex-col gap-1.5 w-full${span2 ? ' md:col-span-2' : ''}`}>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const Section = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="md:col-span-2 flex items-center gap-3 pt-2 mt-1">
        <div className="flex items-center gap-2 text-[#aa2d29]">{icon}</div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</span>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

export default function NewReservationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [form, setForm] = useState<Form>({ ...EMPTY });

    if (!isOpen) return null;

    const set = (key: keyof Form, val: string) => setForm(p => ({ ...p, [key]: val }));

    const handleSave = () => {
        const stored = JSON.parse(localStorage.getItem('customersDB') || '[]');
        const newRecord = {
            ...form,
            id: Date.now(),
            name: `${form.firstName} ${form.lastName}`.trim() || 'Anonymous VIP',
            customerType: form.customerType || 'Individual VIP',
            status: form.status || 'Confirmed',
            createdAt: new Date().toISOString().split('T')[0]
        };

        const updated = [newRecord, ...stored];
        localStorage.setItem('customersDB', JSON.stringify(updated));

        // Dispatch window events so all pages update automatically
        window.dispatchEvent(new Event('customersUpdated'));
        window.dispatchEvent(new Event('storage'));

        setForm({ ...EMPTY });
        onClose();
    };

    const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400";

    const sel = (key: keyof Form, opts: string[], placeholder: string) => (
        <Select value={form[key]} onValueChange={val => set(key, val === 'none' || !val ? '' : val)}>
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
        <Select value={form[key]} onValueChange={val => set(key, val === 'none' || !val ? '' : val)}>
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-7 border-b border-gray-50 pb-5">
                    <div>
                        <h3 className="text-2xl font-heading font-bold text-gray-900">New Reservation</h3>
                        <p className="text-sm text-gray-500 mt-1">Complete the form to log a new VIP transfer booking.</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <Section icon={<User className="w-4 h-4" />} title="Guest Information" />
                    <F label="First Name"><input type="text" placeholder="e.g. James" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inp} /></F>
                    <F label="Last Name"><input type="text" placeholder="e.g. Robertson" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inp} /></F>
                    <F label="Email Address"><input type="email" placeholder="guest@example.com" value={form.email} onChange={e => set('email', e.target.value)} className={inp} /></F>
                    <F label="Phone Number"><input type="text" placeholder="+44 7700 000000" value={form.phone} onChange={e => set('phone', e.target.value)} className={inp} /></F>

                    <Section icon={<Building2 className="w-4 h-4" />} title="Booking Details" />
                    <F label="Guest Type">{sel('customerType', GUEST_TYPES, 'Select guest type')}</F>
                    <F label="B2B Partner (Hotel / Agency)">{sel('company', PARTNERS, 'Select partner or leave blank')}</F>
                    <F label="Status">{sel('status', STATUSES, 'Select status')}</F>
                    <F label="Passengers">{sel('passengers', PAX_OPTIONS, 'Select # of passengers')}</F>

                    <Section icon={<Car className="w-4 h-4" />} title="Transfer Details" />
                    <F label="Transfer Type">{sel('transferType', TRANSFER_TYPES, 'Select transfer type')}</F>
                    <F label="Vehicle Type">{sel('vehicleType', VEHICLE_TYPES, 'Select vehicle')}</F>
                    <F label="Transfer Date">
                        <input
                            type="date"
                            value={form.transferDate}
                            onChange={e => set('transferDate', e.target.value)}
                            className={inp}
                        />
                    </F>
                    <F label="Transfer Time">
                        <input
                            type="time"
                            value={form.transferTime}
                            onChange={e => set('transferTime', e.target.value)}
                            className={inp}
                        />
                    </F>

                    <Section icon={<MapPin className="w-4 h-4" />} title="Route" />
                    <F label="Pick-up Location">{locationSel('pickupLocation', 'Select pick-up point')}</F>
                    <F label="Drop-off Location">{locationSel('dropoffLocation', 'Select drop-off point')}</F>
                    <F label="Flight Number">
                        <div className="relative">
                            <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="e.g. TK 960, PC 1932" value={form.flightNumber} onChange={e => set('flightNumber', e.target.value)} className={inp + " pl-10"} />
                        </div>
                    </F>

                    <Section icon={<Info className="w-4 h-4" />} title="Additional Notes" />
                    <F label="Special Requests / Notes" span2>
                        <textarea placeholder="e.g. Baby seat required, champagne on arrival, meet & greet with name board..." value={form.notes} onChange={e => set('notes', e.target.value)}
                            className={inp + " resize-none h-20"} />
                    </F>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-[#aa2d29] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#8e2622] transition-colors shadow-sm">Create Reservation</button>
                </div>
            </div>
        </div>
    );
}
