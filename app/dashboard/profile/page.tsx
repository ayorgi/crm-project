'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, User, Mail, Briefcase, Phone } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(localStorage.getItem('currentUser') || 'Arda');
    setRole(localStorage.getItem('currentUserRole') || 'Admin');
    setEmail(localStorage.getItem('currentUserEmail') || 'admin@crm.com');
    setPhone(localStorage.getItem('currentUserPhone') || '+1 234 567 890');
    setProfilePic(localStorage.getItem('profilePic') || null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('currentUser', name);
    localStorage.setItem('currentUserRole', role);
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserPhone', phone);
    if (profilePic) localStorage.setItem('profilePic', profilePic);

    // Simulate brief delay for UX
    setTimeout(() => {
      setIsSaving(false);
      window.location.reload(); // Reload to ensure TopNav and Dashboard update cleanly
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 pt-2 animate-in fade-in duration-300">

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-[#aa2d29] to-[#d6413d]"></div>

        <div className="px-8 pb-8">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-8 flex justify-between items-end">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 shadow-md flex items-center justify-center overflow-hidden relative">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2.5 bg-gray-900 text-white rounded-full shadow-lg hover:bg-[#aa2d29] transition-colors cursor-pointer group-hover:scale-105"
                title="Change Photo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all shadow-sm ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#aa2d29] hover:bg-[#8e2622] active:scale-95'}`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <hr className="border-gray-100 mb-8" />

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title / Role</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none"
                  placeholder="System Administrator"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none"
                  placeholder="admin@crm.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
