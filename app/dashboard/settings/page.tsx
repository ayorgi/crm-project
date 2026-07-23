'use client';
import React, { useState, useEffect } from 'react';
import { Settings, Database, Download, AlertOctagon, Check, Globe, Calendar, DollarSign, Lock, Save } from 'lucide-react';

const Toggle = ({ label, description, state, setState }: any) => (
  <div className="flex items-center justify-between p-6 bg-white rounded-3xl hover:shadow-soft transition-all duration-300">
    <div className="pr-4">
      <h4 className="font-semibold text-gray-900 text-sm mb-1">{label}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
    <button 
      onClick={() => setState(!state)}
      className={`w-14 h-7 rounded-full relative transition-colors duration-300 ease-in-out shrink-0 outline-none focus:ring-2 focus:ring-[#aa2d29]/20 focus:ring-offset-1 ${state ? 'bg-[#aa2d29]' : 'bg-gray-200'}`}
    >
      <div 
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm ${state ? 'translate-x-7' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'General' | 'Data'>('General');

  // General Settings
  const [timezone, setTimezone] = useState('Europe/Istanbul');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('USD');

  // Status flags
  const [isSaved, setIsSaved] = useState(false);
  const [showDangerConfirm, setShowDangerConfirm] = useState(false);

  useEffect(() => {
    // Load preferences
    setTimezone(localStorage.getItem('pref_timezone') || 'Europe/Istanbul');
    setDateFormat(localStorage.getItem('pref_dateFormat') || 'DD/MM/YYYY');
    setCurrency(localStorage.getItem('pref_currency') || 'USD');
  }, []);

  const savePreferences = () => {
    localStorage.setItem('pref_timezone', timezone);
    localStorage.setItem('pref_dateFormat', dateFormat);
    localStorage.setItem('pref_currency', currency);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJSON = () => {
    const data = localStorage.getItem('customersDB') || '[]';
    const parsed = JSON.parse(data);
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetDatabase = () => {
    localStorage.removeItem('customersDB');
    window.location.reload();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          localStorage.setItem('customersDB', JSON.stringify(json));
          window.dispatchEvent(new Event('customersUpdated'));
          alert(`Successfully imported ${json.length} guest records into the system!`);
        } else {
          alert('Invalid JSON file. Expected an array of customer objects.');
        }
      } catch (err) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSyncWithServer = () => {
    fetch('/fixed_db.json')
      .then(res => res.json())
      .then(fixedData => {
        localStorage.setItem('customersDB', JSON.stringify(fixedData));
        window.dispatchEvent(new Event('customersUpdated'));
        alert(`Successfully synchronized ${fixedData.length} records from server fixed_db.json!`);
      })
      .catch(() => alert('Failed to fetch fixed_db.json from server.'));
  };

  const tabs = [
    { id: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'Data', icon: <Database className="w-4 h-4" /> },
  ] as const;



  return (
    <div className="max-w-4xl mx-auto pb-10 pt-2 animate-in fade-in duration-300">
      {activeTab !== 'Data' && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={savePreferences}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-md ${isSaved ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-[#aa2d29] hover:bg-[#8e2622] shadow-[#aa2d29]/20 active:scale-95'}`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden flex min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col gap-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white text-[#aa2d29] shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {tab.icon} {tab.id}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          
          {/* GENERAL TAB */}
          {activeTab === 'General' && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">General Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none appearance-none font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Europe/Paris">Europe/Paris (CET)</option>
                      <option value="Europe/Istanbul">Europe/Istanbul (TRT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date Format</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none appearance-none font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g., 31/12/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g., 12/31/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g., 2026-12-31)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Default Currency</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#aa2d29]/20 focus:border-[#aa2d29] transition-all outline-none appearance-none font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="TRY">TRY (₺)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DATA TAB */}
          {activeTab === 'Data' && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Data & Security</h3>
              
              <div className="space-y-6">
                
                {/* Export / Import / Sync */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Sync Server Data */}
                  <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">Sync with GitHub fixed_db.json</h4>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">Force refresh your browser's local memory with the latest <code className="bg-emerald-100/60 px-1.5 py-0.5 rounded text-emerald-800 font-mono text-xs">fixed_db.json</code> file committed on GitHub.</p>
                      <button onClick={handleSyncWithServer} className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors">
                        Force Sync Server Data
                      </button>
                    </div>
                  </div>

                  {/* Upload JSON */}
                  <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                      <Database className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">Import JSON File</h4>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">Select and upload a <code className="bg-purple-100/60 px-1.5 py-0.5 rounded text-purple-800 font-mono text-xs">.json</code> file from your computer to load all guest records into the system instantly.</p>
                      <label className="inline-block px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors cursor-pointer">
                        Upload JSON File
                        <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Export Backup */}
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                      <Download className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">Export Database</h4>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">Download a complete backup of all your VIP guests, transfers, and statuses in JSON format.</p>
                      <button onClick={handleExportJSON} className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                        Download JSON Backup
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 my-8" />

                {/* Danger Zone */}
                <div>
                  <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5" /> Danger Zone
                  </h4>
                  <div className="p-6 bg-red-50/50 border border-red-100 rounded-2xl">
                    <h5 className="font-bold text-gray-900 mb-1">Factory Reset</h5>
                    <p className="text-sm text-gray-600 mb-6">This will permanently delete all customers, transfers, and history from your browser's local storage. This action cannot be undone.</p>
                    
                    {!showDangerConfirm ? (
                      <button onClick={() => setShowDangerConfirm(true)} className="px-5 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors">
                        Reset Entire Database
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-red-200 shadow-sm animate-in zoom-in-95 duration-200">
                        <span className="text-sm font-semibold text-gray-900">Are you absolutely sure?</span>
                        <div className="flex-1" />
                        <button onClick={() => setShowDangerConfirm(false)} className="px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleResetDatabase} className="px-4 py-1.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors">
                          Yes, Delete All Data
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
