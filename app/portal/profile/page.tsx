'use client';
import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, Lock, Check, Trash2, AlertTriangle, Car, Sparkles, VolumeX, Thermometer, Tag, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiFetch } from '@/lib/api';

const PARTNERS = [
  'Kaya Holding', 'Kaya Palazzo Resort', 'Merit Royal Diamond', 'Elexus Hotel Resort',
  'Concorde Luxury Resort', 'Limak Cyprus Deluxe', 'Cratos Premium Hotel',
  'Les Ambassadeurs', "Lord's Palace Hotel", 'Acapulco Resort', 'Arkın Iskele Hotel',
];

const VEHICLES = [
  { value: 'VIP Business Van', label: 'VIP Business Van ($150)' },
  { value: 'Executive Sedan', label: 'Executive Sedan ($120)' },
  { value: 'Premium SUV', label: 'Premium SUV ($200)' },
  { value: 'First Class Sedan', label: 'First Class Sedan ($300)' },
];

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'security'>('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    preferredVehicle: 'VIP Business Van',
    quietRide: 'Yes',
    temperature: '21°C',
    childSeat: 'None',
    meetGreetName: '',
    specialRequests: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMounted(true);

    const currentCustomer = localStorage.getItem('currentCustomer') || '';
    const currentEmail = localStorage.getItem('currentCustomerEmail') || '';
    const currentPhone = localStorage.getItem('currentUserPhone') || '';
    const userProfileKey = currentEmail ? `customerProfile_${currentEmail.toLowerCase().trim()}` : 'customerProfile';
    const savedProfile = JSON.parse(localStorage.getItem(userProfileKey) || localStorage.getItem('customerProfile') || '{}');
    const nameParts = currentCustomer.split(' ');
    const first = savedProfile.firstName || nameParts[0] || '';
    const last = savedProfile.lastName || nameParts.slice(1).join(' ') || '';

    setProfile(prev => ({
      ...prev,
      firstName: first,
      lastName: last,
      email: savedProfile.email || currentEmail,
      phone: savedProfile.phone || currentPhone,
      company: savedProfile.company || '',
      preferredVehicle: savedProfile.preferredVehicle || 'VIP Business Van',
      quietRide: savedProfile.quietRide || 'Yes',
      temperature: savedProfile.temperature || '21°C',
      childSeat: savedProfile.childSeat || 'None',
      meetGreetName: savedProfile.meetGreetName || `${first} ${last}`.trim(),
      specialRequests: savedProfile.specialRequests || '',
    }));

    apiFetch('/me/customer')
      .then(res => res.json())
      .then(result => {
        if (result.status === 'success') {
          const user = result.user || {};
          const customer = result.data || {};
          const nParts = (user.name || '').split(' ');
          const f = customer.first_name || nParts[0] || '';
          const l = customer.last_name || nParts.slice(1).join(' ') || '';

          // Check if there are past reservations to extract preferences from notes if missing
          const reservations = customer.reservations || [];
          let extractedQuiet = '';
          let extractedClimate = '';
          let extractedChildSeat = '';
          let extractedMeetSign = '';
          let extractedNotes = '';

          if (reservations.length > 0) {
            const latestNotes = reservations[0]?.notes || '';
            const qMatch = latestNotes.match(/\[Quiet Ride:\s*([^\]]+)\]/i);
            const cMatch = latestNotes.match(/\[Climate:\s*([^\]]+)\]/i);
            const csMatch = latestNotes.match(/\[Child Seat:\s*([^\]]+)\]/i);
            const msMatch = latestNotes.match(/\[Meet Sign:\s*([^\]]+)\]/i);
            const nMatch = latestNotes.match(/Notes:\s*(.*)$/i);

            if (qMatch) extractedQuiet = qMatch[1].trim().includes('Silent') || qMatch[1].trim() === 'Yes' ? 'Yes' : 'No';
            if (cMatch) extractedClimate = cMatch[1].trim();
            if (csMatch) extractedChildSeat = csMatch[1].trim();
            if (msMatch) extractedMeetSign = msMatch[1].trim();
            if (nMatch) extractedNotes = nMatch[1].trim();
          }

          setProfile(prev => {
            const updated = {
              ...prev,
              firstName: f || prev.firstName,
              lastName: l || prev.lastName,
              email: user.email || customer.email || prev.email,
              phone: customer.phone || user.phone || prev.phone || '',
              company: customer.company || prev.company || '',
              preferredVehicle: customer.preferred_vehicle || prev.preferredVehicle || (reservations[0]?.vehicle_type) || 'VIP Business Van',
              quietRide: prev.quietRide || extractedQuiet || 'Yes',
              temperature: prev.temperature || extractedClimate || '21°C',
              childSeat: prev.childSeat || extractedChildSeat || 'None',
              meetGreetName: prev.meetGreetName || extractedMeetSign || `${f || prev.firstName} ${l || prev.lastName}`.trim(),
              specialRequests: prev.specialRequests || extractedNotes || '',
            };
            localStorage.setItem('customerProfile', JSON.stringify(updated));
            if (updated.email) {
              localStorage.setItem(`customerProfile_${updated.email.toLowerCase().trim()}`, JSON.stringify(updated));
            }
            return updated;
          });

          if (user.phone) localStorage.setItem('currentUserPhone', user.phone);
        }
      })
      .catch(err => console.error('Error loading live profile:', err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('customerProfile', JSON.stringify(profile));
    if (profile.email) {
      localStorage.setItem(`customerProfile_${profile.email.toLowerCase().trim()}`, JSON.stringify(profile));
    }
    if (profile.firstName) {
      const newName = `${profile.firstName} ${profile.lastName}`.trim();
      localStorage.setItem('currentCustomer', newName);
      if (profile.phone) localStorage.setItem('currentUserPhone', profile.phone);
      window.dispatchEvent(new Event('customerProfileUpdated'));
    }

    try {
      await apiFetch('/me/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone: profile.phone,
          company: profile.company,
          preferred_vehicle: profile.preferredVehicle,
          password: profile.newPassword || undefined,
        }),
      });
    } catch (err) {
      console.error('Error saving profile to backend:', err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiFetch('/me', { method: 'DELETE' });
    } catch {
      // Continue cleanup
    } finally {
      const keysToRemove = [
        'currentCustomer', 'currentCustomerEmail', 'currentUser', 'currentUserEmail',
        'currentUserRole', 'userRole', 'sanctum_token', 'customersDB',
        'customerProfile', 'profilePic', 'currentUserPhone',
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      setIsDeleting(false);
      router.push('/login');
    }
  };

  const inpClass = "w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-slate-900 placeholder:text-slate-400";

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-pulse space-y-8">
        <div className="bg-white rounded-3xl p-8 h-32 border border-slate-100"></div>
        <div className="bg-white rounded-3xl p-8 h-80 border border-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      {/* Top Banner Card with Slate-900 Dark Navy Touch */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#aa2d29] text-white flex items-center justify-center font-heading font-black text-2xl shadow-md border border-rose-800 shrink-0">
            {(profile.firstName?.[0] || 'V').toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white font-heading">
                {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'VIP Client Profile'}
              </h1>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              {profile.company ? `${profile.company} — Corporate Member` : 'VIP Corporate Client'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified VIP Account</span>
        </div>
      </div>

      {/* CLEAN TABS BAR */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'personal'
              ? 'bg-[#aa2d29] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'bg-[#aa2d29] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>VIP Preferences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-[#aa2d29] text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {/* TAB CONTENT & FORM */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* TAB 1: Personal Details */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
              <User className="w-5 h-5 text-[#aa2d29]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Personal Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your primary contact details used for reservations and transfer updates.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">First Name *</label>
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Şahin"
                  value={profile.lastName}
                  onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                  className={inpClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address *</label>
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                <input
                  type="text"
                  placeholder="+90 533 000 0000"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className={inpClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company / Partner Hotel (Optional)</label>
              <Select value={profile.company} onValueChange={val => setProfile({ ...profile, company: val === 'none' || !val ? '' : val })}>
                <SelectTrigger className="w-full h-12 text-sm bg-slate-50/80 border-slate-200 rounded-xl focus:border-[#aa2d29]">
                  <SelectValue placeholder="Select partner hotel or company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none" className="text-slate-400 italic">-- Individual Guest (No Partner) --</SelectItem>
                    {PARTNERS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* TAB 2: VIP Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
              <Sparkles className="w-5 h-5 text-[#aa2d29]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">VIP Cabin & Ride Preferences</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your customized comfort preferences followed by our chauffeurs during every transfer.</p>
              </div>
            </div>

            {/* Preferred Vehicle */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Vehicle Type</label>
              <Select value={profile.preferredVehicle} onValueChange={val => setProfile({ ...profile, preferredVehicle: val || '' })}>
                <SelectTrigger className="w-full h-12 text-sm bg-slate-50/80 border-slate-200 rounded-xl focus:border-[#aa2d29]">
                  <SelectValue placeholder="Select preferred vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {VEHICLES.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Quiet Ride & Temperature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quiet Ride */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-[#aa2d29]" /> Quiet Ride Mode
                </label>
                <Select value={profile.quietRide} onValueChange={val => setProfile({ ...profile, quietRide: val || '' })}>
                  <SelectTrigger className="w-full h-12 text-sm bg-slate-50/80 border-slate-200 rounded-xl focus:border-[#aa2d29]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes (Silent Cabin - No Chauffeur Small Talk)</SelectItem>
                    <SelectItem value="No">No (Standard Friendly Chauffeur)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#aa2d29]" /> Cabin Temperature (AC)
                </label>
                <Select value={profile.temperature} onValueChange={val => setProfile({ ...profile, temperature: val || '' })}>
                  <SelectTrigger className="w-full h-12 text-sm bg-slate-50/80 border-slate-200 rounded-xl focus:border-[#aa2d29]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20°C">20°C (Cool & Fresh)</SelectItem>
                    <SelectItem value="21°C">21°C (Optimal Climate)</SelectItem>
                    <SelectItem value="22°C">22°C (Warm Comfort)</SelectItem>
                    <SelectItem value="23°C">23°C (Cozy Warm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Child Seat & Meet Greet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Child / Baby Seat */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Child / Baby Seat Requirement</label>
                <Select value={profile.childSeat} onValueChange={val => setProfile({ ...profile, childSeat: val || '' })}>
                  <SelectTrigger className="w-full h-12 text-sm bg-slate-50/80 border-slate-200 rounded-xl focus:border-[#aa2d29]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None (Standard Adult Passengers)</SelectItem>
                    <SelectItem value="1 Infant Seat">1 Infant Seat (0-12 Months)</SelectItem>
                    <SelectItem value="1 Child Seat">1 Child Safety Seat (1-4 Years)</SelectItem>
                    <SelectItem value="1 Booster Seat">1 Booster Seat (4-8 Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meet & Greet Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#aa2d29]" /> Airport Meet & Greet Signage Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Eren Kaya or Kaya Holding"
                  value={profile.meetGreetName}
                  onChange={e => setProfile({ ...profile, meetGreetName: e.target.value })}
                  className={inpClass}
                />
              </div>
            </div>

            {/* Special Requests & Beverage Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Special Requests & Cabin Amenities
              </label>
              <textarea
                placeholder="e.g. Still mineral water required, cabin Wi-Fi details requested, preferred music genre..."
                value={profile.specialRequests}
                onChange={e => setProfile({ ...profile, specialRequests: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-slate-900 placeholder:text-slate-400 h-28 resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: Security */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-2">
              <Lock className="w-5 h-5 text-[#aa2d29]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Security & Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update your account password to maintain maximum security.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Password</label>
              <input
                type="password"
                name="current-password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={profile.currentPassword}
                onChange={e => setProfile({ ...profile, currentPassword: e.target.value })}
                className={inpClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                <input
                  type="password"
                  name="new-password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={profile.newPassword}
                  onChange={e => setProfile({ ...profile, newPassword: e.target.value })}
                  className={inpClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm-new-password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={profile.confirmPassword}
                  onChange={e => setProfile({ ...profile, confirmPassword: e.target.value })}
                  className={inpClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* SAVE BAR */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            All updates are saved securely to your VIP Profile & Cabin Preferences.
          </div>
          <button
            type="submit"
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold shadow-md text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              saved
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-[#aa2d29] text-white hover:bg-[#8e2622] shadow-[#aa2d29]/20 active:scale-95'
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

        {/* COMPACT DANGER ZONE (Security Tab Only - Placed Below Save Bar) */}
        {activeTab === 'security' && (
          <div className="bg-rose-50/40 rounded-2xl p-5 border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div>
              <p className="text-xs font-bold text-rose-950 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Danger Zone: Delete Account
              </p>
              <p className="text-[11px] text-rose-600 font-medium mt-0.5">
                Permanently remove your account and all reservation history from our system.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 font-bold rounded-xl transition-all text-xs flex items-center gap-1.5 shrink-0 shadow-xs shadow-rose-600/20 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Account
            </button>
          </div>
        )}
      </form>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Account Permanently?</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              This action <span className="font-bold text-red-600">cannot be undone</span>. All your data including account credentials, guest profile, and reservation history will be permanently deleted from our database.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}