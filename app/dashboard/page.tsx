/* eslint-disable */
'use client';
import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, Car, Trash2 } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, PolarRadiusAxis, Label, ResponsiveContainer } from 'recharts';

import { parseDate, getTimestamp, formatDateBadge } from '@/lib/dateUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVehiclePrice } from '@/lib/utils';

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

const TargetGaugeCard = ({ totalRevenue, target = 20000, completedCount }: { totalRevenue: number; target?: number; completedCount: number }) => {
  const percentageNum = Math.min((totalRevenue / target) * 100, 100);
  const percentage = percentageNum.toFixed(2);
  
  const chartData = [
    {
      name: 'Target',
      value: percentageNum,
      fill: '#aa2d29',
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-gray-100/80 overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-8 pb-0">
        <h3 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">Monthly Target</h3>
      </div>

      {/* Recharts Radial Bar Chart Semi-Circle */}
      <div className="flex flex-col items-center justify-center my-2 h-48">
        <ResponsiveContainer width="100%" height={250}>
          <RadialBarChart
            cx="50%"
            cy="75%"
            innerRadius="90%"
            outerRadius="98%"
            barSize={8}
            data={chartData}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: '#f1f5f9' }}
              dataKey="value"
              cornerRadius={6}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const cx = viewBox.cx || 0;
                    const cy = viewBox.cy || 0;
                    return (
                      <g>
                        <text x={cx} y={cy - 38} textAnchor="middle" className="fill-gray-900 text-4xl font-black font-heading tracking-tight">
                          {percentage}%
                        </text>
                        <text x={cx} y={cy - 14} textAnchor="middle" className="fill-gray-400 text-xs font-semibold uppercase tracking-wider">
                          Progress
                        </text>
                      </g>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Shaded Footer Bar (100% Dynamic & Compatible) */}
      <div className="bg-gray-50/70 border-t border-gray-100 p-5 px-6 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs font-semibold text-gray-400">Target</p>
          <p className="text-base font-bold text-gray-900 mt-1">${(target / 1000).toFixed(0)}K</p>
        </div>
        <div className="border-x border-gray-200/60 px-1">
          <p className="text-xs font-semibold text-gray-400">Revenue</p>
          <p className="text-base font-bold text-emerald-600 mt-1">${totalRevenue.toLocaleString()} <span className="text-emerald-500 text-xs">↑</span></p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400">Completed</p>
          <p className="text-base font-bold text-gray-900 mt-1">{completedCount} Rides</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [name, setName] = useState('Arda');
  const [greeting, setGreeting] = useState('Welcome');
  const [customers, setCustomers] = useState<any[]>([]);
  const [dismissedRecent, setDismissedRecent] = useState<any[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
    const saved = localStorage.getItem('currentUser');
    if (saved) setName(saved);

    fetch('/fixed_db.json')
      .then(res => res.json())
      .then(fixedData => {
        const stored = JSON.parse(localStorage.getItem('customersDB') || '[]');
        const storedMap = new Map<any, any>(stored.map((item: any) => [item.id, item]));

        const mergedMap = new Map();
        fixedData.forEach((item: any) => {
          const itemClean = {
            ...item,
            customerType: item.customerType === 'Hotel Guest' ? 'Corporate Agency' : (item.customerType || (item.company ? 'Corporate Agency' : 'Individual VIP'))
          };
          if (storedMap.has(item.id)) {
            const s = storedMap.get(item.id);
            itemClean.status = s.status || itemClean.status;
          }
          mergedMap.set(item.id, itemClean);
        });

        stored.forEach((item: any) => {
          if (!mergedMap.has(item.id)) {
            mergedMap.set(item.id, item);
          }
        });

        const fullList = Array.from(mergedMap.values());
        setCustomers(fullList);
        localStorage.setItem('customersDB', JSON.stringify(fullList));
      })
      .catch(() => {
        const stored = JSON.parse(localStorage.getItem('customersDB') || '[]');
        setCustomers(stored);
      });

    const dismissed = JSON.parse(localStorage.getItem('dismissedRecent') || '[]');
    setDismissedRecent(dismissed);
  }, []);

  const handleRemove = (id: any) => {
    // Only dismiss from Recently Added widget view without deleting customer from system!
    const updated = [...dismissedRecent, id];
    setDismissedRecent(updated);
    localStorage.setItem('dismissedRecent', JSON.stringify(updated));
  };

  const handleStatusChange = (id: any, newStatus: string) => {
    const updated = customers.map(c => c.id === id ? { ...c, status: newStatus } : c);
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
  const recent = [...customers]
    .filter(c => !dismissedRecent.includes(c.id))
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    .slice(0, 5);

  const totalRevenue = customers.reduce((sum, c) => {
    if (c.status !== 'Cancelled') {
      return sum + getVehiclePrice(c.vehicleType);
    }
    return sum;
  }, 0);

  const now = new Date().setHours(0, 0, 0, 0);
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
    <div className="max-w-7xl mx-auto pt-2">

      {/* Bento Box Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <StatCard label="Total Unique Guests" value={uniqueGuestsCount} span2 footer={<span className="text-[#aa2d29]">Across {totalTransfers} total transfers</span>} />
        <StatCard label="Completed" value={completed} footer={`${totalTransfers ? Math.round((completed / totalTransfers) * 100) : 0}% of all transfers`} />
        <StatCard label="At Risk Guests" value={atRiskCount} footer="Require engagement" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-start">
        {/* Left Column: Monthly Target Gauge + Recently Added */}
        <div className="space-y-8 flex flex-col">
          <TargetGaugeCard totalRevenue={totalRevenue} target={20000} completedCount={completed} />

          <div className="bg-white rounded-3xl shadow-soft overflow-hidden flex flex-col">
            <div className="p-8 pb-4 bg-white">
              <h3 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">Recently Added</h3>
            </div>
            <div className="px-6 pb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                  {recent.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3.5 px-3">
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
                      <td className="py-3.5 px-3 text-gray-500">{c.email}</td>
                      <td className="py-3.5 px-3 text-right">
                        <Select
                          value={c.status || 'Pending'}
                          onValueChange={(val) => val && handleStatusChange(c.id, val)}
                        >
                          <SelectTrigger className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border-0 h-auto cursor-pointer shadow-none focus:ring-0 outline-none select-none ${c.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                            c.status === 'In Transit' ? 'bg-amber-50 text-amber-600' :
                              c.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                                c.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                  'bg-gray-100 text-gray-600'
                            }`}>
                            <SelectValue>{c.status || 'Pending'}</SelectValue>
                          </SelectTrigger>
                          <SelectContent align="end" className="w-36 text-xs font-medium">
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 && <tr><td colSpan={3} className="py-12 px-6 text-center text-gray-500">No guests yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Operations */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden p-8 flex flex-col">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading font-bold text-gray-900 tracking-tight">Upcoming Operations</h3>
            </div>
            <div className="flex flex-col gap-3.5">
              {upcomingOps.map((op, i) => {
                const { day, month } = formatDateBadge(op.transferDate);
                return (
                  <div key={op.id || i} className="group">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-2.5">

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

                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${op.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                          op.status === 'In Transit' ? 'bg-amber-50 text-amber-600' :
                            op.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                              op.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                'bg-gray-100 text-gray-600'
                          }`}>
                          {op.status || 'Pending'}
                        </span>
                      </div>

                      {/* Route & Vehicle */}
                      <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between gap-2 text-xs">
                        <div className="font-semibold text-gray-600 truncate flex items-center gap-1.5 flex-1">
                          <span className="text-gray-400 font-bold">Route:</span>
                          <span className="truncate">{op.pickupLocation || 'Unknown'} ➔ {op.dropoffLocation || 'Unknown'}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider shrink-0">
                          {op.vehicleType || 'No Vehicle'}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
              {upcomingOps.length === 0 && (
                <div className="text-sm text-gray-500 py-4 text-center">No upcoming operations scheduled.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
