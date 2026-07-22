/* eslint-disable */
'use client';
import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, Car, Trash2 } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { parseDate, getTimestamp, formatDateBadge } from '@/lib/dateUtils';

const pct = (n: number, total: number) => total ? Math.round((n / total) * 100) : 0;

const StatCard = ({ label, value, footer, span2 }: any) => {
  return (
    <div className={`bg-white rounded-3xl p-8 shadow-soft flex flex-col justify-between ${span2 ? 'md:col-span-2' : ''}`}>
      <div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="mt-8">
        <div className="text-6xl font-black text-gray-900 font-heading tracking-tighter mb-2">{value}</div>
        <div className="text-sm font-semibold text-gray-500">{footer}</div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [name, setName] = useState('Arda');
  const [greeting, setGreeting] = useState('Welcome');
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    const saved = localStorage.getItem('currentUser');
    if (saved) setName(saved);
    setCustomers(JSON.parse(localStorage.getItem('customersDB') || '[]'));
  }, []);

  const handleRemove = (id: any) => {
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    localStorage.setItem('customersDB', JSON.stringify(updated));
  };

  const totalTransfers = customers.length;
  
  const grouped = new Map();
  const parseDateObj = (dStr: string) => {
    if (!dStr) return new Date(0);
    if (dStr.includes('/')) {
      const parts = dStr.split('/');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        return isNaN(d.getTime()) ? new Date(0) : d;
      }
    }
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? new Date(0) : d;
  };

  customers.forEach(c => {
    const id = c.email ? c.email.toLowerCase().trim() : `${c.firstName || ''} ${c.lastName || ''}`.trim().toLowerCase() || c.name || Math.random().toString();
    const date = parseDateObj(c.transferDate);
    if (!grouped.has(id)) {
      grouped.set(id, { type: c.customerType || 'Individual', company: c.company, transfers: 0, latestDate: date });
    }
    const g = grouped.get(id);
    g.transfers += 1;
    if (date.getTime() > g.latestDate.getTime()) g.latestDate = date;
  });

  const uniqueGuestsCount = grouped.size;
  let atRiskCount = 0;
  grouped.forEach(g => {
    const monthsSinceLastActive = (new Date().getTime() - g.latestDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    let segment = 'One-Time Passenger';
    if (g.type === 'Corporate Agency' || g.company) segment = 'Corporate';
    else if (g.transfers >= 2) segment = 'Frequent Flyer';
    else if (monthsSinceLastActive >= 2 || g.latestDate.getTime() === 0) segment = 'At-Risk';
    if (segment === 'At-Risk') atRiskCount++;
  });

  const completed = customers.filter(c => c.status === 'Completed').length;
  const recent = [...customers].reverse().slice(0, 5);

  const now = new Date().setHours(0,0,0,0);
  const upcomingOps = customers
    .filter(c => getTimestamp(c.transferDate) >= now && c.status !== 'Cancelled')
    .sort((a, b) => {
      const dateDiff = getTimestamp(a.transferDate) - getTimestamp(b.transferDate);
      if (dateDiff === 0) {
         return (a.transferTime || '00:00').localeCompare(b.transferTime || '00:00');
      }
      return dateDiff;
    })
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl text-gray-900 font-heading font-bold tracking-tight">{greeting}, <span className="text-[#aa2d29]">{name}</span></h2>
        <p className="text-gray-500 mt-2 text-lg">Here's what's happening with your VIP guests today.</p>
      </div>

      {/* Bento Box Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <StatCard label="Total Unique Guests" value={uniqueGuestsCount} span2 footer={<span className="text-[#aa2d29]">Across {totalTransfers} total transfers</span>} />
        <StatCard label="Completed" value={completed} footer={`${totalTransfers ? Math.round((completed / totalTransfers) * 100) : 0}% of all transfers`} />
        <StatCard label="At Risk Guests" value={atRiskCount} footer="Require engagement" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden flex flex-col self-start">
          <div className="p-8 pb-4 bg-white">
            <h3 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">Recently Added</h3>
          </div>
          <div className="px-4 pb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <th className="py-4 px-4">Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {recent.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group rounded-xl">
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-gray-900 group-hover:text-[#aa2d29] transition-colors cursor-pointer">
                          {c.firstName ? `${c.firstName} ${c.lastName}` : c.name}
                        </span>
                        <button
                          onClick={() => handleRemove(c.id)}
                          title="Remove from list"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500">{c.email}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        c.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                        c.status === 'In Transit' ? 'bg-amber-50 text-amber-600' :
                        c.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                        c.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {c.status || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td colSpan={3} className="py-12 px-6 text-center text-gray-500">No guests yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-soft overflow-hidden p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">Upcoming Operations</h3>
          </div>
          <div className="flex-1 relative pt-2">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100"></div>
            <div className="flex flex-col gap-6">
              {upcomingOps.map((op, i) => {
                const { day, month } = formatDateBadge(op.transferDate);
                return (
                  <div key={op.id || i} className="relative pl-12 group">
                    <div className={`absolute left-0 top-3 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 ${op.status === 'In Transit' ? 'bg-amber-500 text-white' : op.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>
                      {op.status === 'In Transit' ? <Car className="w-3.5 h-3.5" /> : op.status === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 text-gray-500" />}
                    </div>
                    <div className="bg-gray-50 hover:bg-gray-100/80 transition-colors p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
                      
                      {/* Top Header: Calendar Date Badge & Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-200/60 rounded-xl px-3 py-1 text-[#aa2d29] min-w-[54px] shadow-xs shrink-0">
                            <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{month}</span>
                            <span className="text-xl font-black font-heading leading-tight">{day}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-900">
                              <Clock className="w-3.5 h-3.5 text-[#aa2d29]" />
                              <span>{op.transferTime || 'TBA'}</span>
                            </div>
                            <div className="text-base font-bold text-gray-900 mt-0.5">{op.firstName} {op.lastName}</div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          op.status === 'In Transit' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200/80 text-gray-700'
                        }`}>
                          {op.status || 'Confirmed'}
                        </span>
                      </div>

                      {/* Route & Vehicle */}
                      <div className="pt-2 border-t border-gray-200/50 flex flex-col gap-1">
                        <div className="text-xs font-semibold text-gray-600 truncate flex items-center gap-1.5">
                          <span className="text-gray-400 font-bold">Route:</span>
                          <span>{op.pickupLocation || 'Unknown'} ➔ {op.dropoffLocation || 'Unknown'}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">
                          {op.vehicleType || 'No Vehicle Specified'}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
              {upcomingOps.length === 0 && (
                <div className="pl-12 text-sm text-gray-500 py-4">No upcoming operations scheduled.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
