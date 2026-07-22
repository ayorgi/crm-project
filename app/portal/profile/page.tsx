'use client'
import React, { useState, useEffect } from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PARTNERS = [
    'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
    'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
    'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

const F = ({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) => (
    <div className={`flex flex-col gap-1.5 w-full${span2 ? ' md:col-span-2' : ''}`}>
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        firstName: '', lastName: '', email: '', phone: '', company: ''
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
        if (savedProfile.firstName) {
            setProfile(savedProfile);
        }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('customerProfile', JSON.stringify(profile));
        if (profile.firstName) {
            const newName = `${profile.firstName} ${profile.lastName}`.trim();
            localStorage.setItem('currentCustomer', newName);
            window.dispatchEvent(new Event('customerProfileUpdated'));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400";
    
    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300 pb-10">
            <div className="mb-8">
                <h1 className="text-3xl text-gray-900 font-heading font-bold tracking-tight">My Profile</h1>
                <p className="text-gray-500 mt-1">Keep your details up to date for faster bookings.</p>
            </div>
            
            <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-soft p-8 space-y-6">
                
                <div className="flex items-center gap-3 pt-2 mt-1 mb-4">
                    <div className="flex items-center gap-2 text-[#aa2d29]"><User className="w-4 h-4" /></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Information</span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <F label="First Name">
                        <input required type="text" placeholder="e.g. James" value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} className={inp} />
                    </F>
                    <F label="Last Name">
                        <input required type="text" placeholder="e.g. Robertson" value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} className={inp} />
                    </F>
                    <F label="Email Address">
                        <input required type="email" placeholder="guest@example.com" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className={inp} />
                    </F>
                    <F label="Phone Number">
                        <input type="text" placeholder="+44 7700 000000" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className={inp} />
                    </F>
                    <F label="Company / Partner Name (Optional)" span2>
                        <Select value={profile.company} onValueChange={val => setProfile({ ...profile, company: val === 'none' || !val ? '' : val })}>
                            <SelectTrigger className="w-full h-10 text-sm bg-gray-50 border-gray-200 focus:border-[#aa2d29]">
                                <SelectValue placeholder="Select partner or leave blank" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="none" className="text-gray-400 italic">-- Clear Selection --</SelectItem>
                                    {PARTNERS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </F>
                </div>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-4">
                    {saved ? <span className="text-emerald-600 font-bold text-sm flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Saved Successfully</span> : <span></span>}
                    <button type="submit" className="bg-[#aa2d29] text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#8e2622] transition-colors shadow-sm">
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
}