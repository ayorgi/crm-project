'use client';
import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, Lock, Check } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PARTNERS = [
  'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
  'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
  'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

const VEHICLES = [
  'VIP Business Van', 'Executive Sedan', 'Premium SUV', 'First Class Sedan'
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    preferredVehicle: 'VIP Business Van',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    if (savedProfile && Object.keys(savedProfile).length > 0) {
      setProfile(prev => ({ ...prev, ...savedProfile }));
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

  const inpClass = "w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100/80 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#aa2d29] flex items-center justify-center font-heading font-black text-2xl border border-rose-100 shrink-0 shadow-xs">
            {(profile.firstName?.[0] || 'V').toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 font-heading">
                {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'VIP Client'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-[#aa2d29] border border-rose-200/60">
                VIP Executive
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {profile.email || 'Configure your personal details & security preferences'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-3xl shadow-soft p-8 border border-gray-100/80 space-y-8">
          {/* Section 1: Personal Details */}
          <div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <User className="w-5 h-5 text-[#aa2d29]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Personal Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">First Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Arda"
                  value={profile.firstName}
                  onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                  className={inpClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Last Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Şahin"
                  value={profile.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                  className={inpClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="guest@example.com"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className={inpClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                <input
                  type="text"
                  placeholder="+90 533 000 0000"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className={inpClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Preferred Vehicle</label>
                <Select value={profile.preferredVehicle} onValueChange={val => val && setProfile({ ...profile, preferredVehicle: val })}>
                  <SelectTrigger className="w-full h-12 text-sm bg-gray-50/80 border-gray-200 rounded-xl focus:border-[#aa2d29]">
                    <SelectValue placeholder="Select preferred vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Company / Partner Hotel (Optional)</label>
                <Select value={profile.company} onValueChange={val => setProfile({ ...profile, company: val === 'none' || !val ? '' : val })}>
                  <SelectTrigger className="w-full h-12 text-sm bg-gray-50/80 border-gray-200 rounded-xl focus:border-[#aa2d29]">
                    <SelectValue placeholder="Select partner or leave blank for individual guest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none" className="text-gray-400 italic">-- Individual Guest (No Partner) --</SelectItem>
                      {PARTNERS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Security */}
          <div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <Lock className="w-5 h-5 text-[#aa2d29]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Security</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={profile.currentPassword}
                  onChange={e => setProfile({ ...profile, currentPassword: e.target.value })}
                  className={inpClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={profile.newPassword}
                  onChange={e => setProfile({ ...profile, newPassword: e.target.value })}
                  className={inpClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={profile.confirmPassword}
                  onChange={e => setProfile({ ...profile, confirmPassword: e.target.value })}
                  className={inpClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100/80 flex items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium">
            All updates are saved securely to your VIP Profile.
          </div>
          <button
            type="submit"
            className={`px-8 py-3 rounded-2xl font-bold shadow-md text-sm flex items-center gap-2 ${
              saved
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-[#aa2d29] text-white hover:bg-[#8e2622] shadow-[#aa2d29]/20'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Saved Successfully!
              </>
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Profile Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}