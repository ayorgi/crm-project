'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Activity, Calendar, Clock, Map, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<any[]>([]);
  const [topRoutesData, setTopRoutesData] = useState<any[]>([]);
  const [topPartnersData, setTopPartnersData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [kpi, setKpi] = useState({ total: 0, busiestDay: '-', peakHour: '-', topRoute: '-' });

  useEffect(() => {
    const customers = JSON.parse(localStorage.getItem('customersDB') || '[]');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fleet: Record<string, any> = {};
    days.forEach(d => fleet[d] = { name: d, van: 0, execSedan: 0, minibus: 0, firstSedan: 0, suv: 0, total: 0 });

    const hours: Record<string, number> = { '00:00': 0, '04:00': 0, '08:00': 0, '12:00': 0, '16:00': 0, '20:00': 0 };
    const routes: Record<string, number> = {};
    const partners: Record<string, number> = {};
    const statuses: Record<string, number> = { 'Confirmed': 0, 'In Transit': 0, 'Completed': 0, 'Cancelled': 0 };

    customers.forEach((c: any) => {
      // Status
      if (c.status) statuses[c.status] = (statuses[c.status] || 0) + 1;

      // Date / Fleet
      if (c.transferDate) {
        const d = new Date(c.transferDate);
        if (!isNaN(d.getTime())) {
          const dayName = days[d.getDay()];
          fleet[dayName].total++;
          if (c.vehicleType?.includes('Van')) fleet[dayName].van++;
          else if (c.vehicleType?.includes('Executive') || (c.vehicleType?.includes('Sedan') && !c.vehicleType?.includes('First'))) fleet[dayName].execSedan++;
          else if (c.vehicleType?.includes('Minibus')) fleet[dayName].minibus++;
          else if (c.vehicleType?.includes('First')) fleet[dayName].firstSedan++;
          else if (c.vehicleType?.includes('SUV')) fleet[dayName].suv++;
        }
      }
      
      // Time
      if (c.transferTime) {
        const hour = parseInt(c.transferTime.split(':')[0], 10);
        if (!isNaN(hour)) {
          if (hour < 4) hours['00:00']++;
          else if (hour < 8) hours['04:00']++;
          else if (hour < 12) hours['08:00']++;
          else if (hour < 16) hours['12:00']++;
          else if (hour < 20) hours['16:00']++;
          else hours['20:00']++;
        }
      }

      // Routes
      if (c.pickupLocation && c.dropoffLocation) {
        let p = c.pickupLocation.replace(/ (City Centre|International Airport|Airport|Area|Resort)/g, '');
        let d = c.dropoffLocation.replace(/ (City Centre|International Airport|Airport|Area|Resort)/g, '');
        const route = `${p} ➔ ${d}`;
        routes[route] = (routes[route] || 0) + 1;
      }

      // Partners
      if (c.company) {
        partners[c.company] = (partners[c.company] || 0) + 1;
      }
    });

    // Formatting Data for Charts
    setFleetData([fleet['Mon'], fleet['Tue'], fleet['Wed'], fleet['Thu'], fleet['Fri'], fleet['Sat'], fleet['Sun']]);
    setPeakHoursData(Object.entries(hours).map(([time, transfers]) => ({ time, transfers })));
    
    const sortedRoutes = Object.entries(routes).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
    setTopRoutesData(sortedRoutes);
    setTopPartnersData(Object.entries(partners).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count })));
    
    const statusColors: any = { 'Confirmed': '#10b981', 'In Transit': '#f59e0b', 'Completed': '#3b82f6', 'Cancelled': '#ef4444' };
    setStatusData(Object.entries(statuses).map(([name, value]) => ({ name, value, color: statusColors[name] || '#9ca3af' })));

    // KPI Calculations
    let maxDay = '-', maxDayVal = 0;
    Object.values(fleet).forEach(f => { if (f.total > maxDayVal) { maxDayVal = f.total; maxDay = f.name; } });
    
    let maxHour = '-', maxHourVal = 0;
    Object.entries(hours).forEach(([h, v]) => { if (v > maxHourVal) { maxHourVal = v; maxHour = h; } });

    setKpi({
      total: customers.length,
      busiestDay: maxDayVal > 0 ? maxDay : 'N/A',
      peakHour: maxHourVal > 0 ? maxHour : 'N/A',
      topRoute: sortedRoutes.length > 0 ? sortedRoutes[0].name.split('➔')[0].trim() : 'N/A'
    });

  }, []);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-gray-800">
          <p className="font-bold mb-1">{payload[0].payload.name || payload[0].payload.time}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke || p.fill }} />
              <span className="text-gray-300">{p.name}:</span>
              <span className="font-semibold">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-10 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl text-gray-900 font-bold tracking-tight">Analytics Center</h2>
          <p className="text-gray-500 mt-1 text-base">Comprehensive performance and operational insights.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Volume</span>
            <div className="p-2 bg-[#aa2d29]/10 text-[#aa2d29] rounded-xl group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{kpi.total}</div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% this month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Busiest Day</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Calendar className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{kpi.busiestDay}</div>
          <div className="text-xs font-semibold text-gray-500">Highest transfer volume</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Peak Hour</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-gray-900 mb-1">{kpi.peakHour}</div>
          <div className="text-xs font-semibold text-gray-500">Most operational activity</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Pick-up</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform"><Map className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-black text-gray-900 mb-1 truncate" title={kpi.topRoute}>{kpi.topRoute}</div>
          <div className="text-xs font-semibold text-gray-500">Most frequent origin</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Fleet Utilization (Col Span 2) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 group">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">Fleet Utilization <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase rounded-full">Weekly</span></h3>
          <div className="h-72 w-full transition-opacity group-hover:opacity-90">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fleetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVan" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#aa2d29" stopOpacity={0.8}/><stop offset="95%" stopColor="#aa2d29" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorMinibus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorSUV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/><stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorExecSedan" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4b5563" stopOpacity={0.8}/><stop offset="95%" stopColor="#4b5563" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorFirstSedan" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#111827" stopOpacity={0.8}/><stop offset="95%" stopColor="#111827" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="firstSedan" stackId="1" name="1st Class Sedan" stroke="#111827" strokeWidth={2} fillOpacity={1} fill="url(#colorFirstSedan)" />
                <Area type="monotone" dataKey="execSedan" stackId="1" name="Exec. Sedan" stroke="#4b5563" strokeWidth={2} fillOpacity={1} fill="url(#colorExecSedan)" />
                <Area type="monotone" dataKey="suv" stackId="1" name="Premium SUV" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorSUV)" />
                <Area type="monotone" dataKey="minibus" stackId="1" name="Luxury Minibus" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorMinibus)" />
                <Area type="monotone" dataKey="van" stackId="1" name="VIP Van" stroke="#aa2d29" strokeWidth={3} fillOpacity={1} fill="url(#colorVan)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Doughnut (Col Span 1) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col group">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Transfer Status</h3>
          <p className="text-xs text-gray-400 mb-4">Current distribution of all transfers</p>
          <div className="flex-1 min-h-[200px] w-full relative transition-transform group-hover:scale-105 duration-500">
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-3xl font-black text-gray-900">{kpi.total}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
            </div>
            <ResponsiveContainer width="100%" height="100%" className="relative z-10">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
            {statusData.map(s => (
               <div key={s.name} className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                 {s.name}
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1 group">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Peak Hours</h3>
          <div className="h-64 w-full transition-opacity group-hover:opacity-90">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="transfers" name="Transfers" stroke="#374151" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#aa2d29', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1 group">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Frequent Routes</h3>
          <div className="h-64 w-full transition-opacity group-hover:opacity-90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRoutesData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563', fontWeight: 600 }} width={120} />
                <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
                <Bar dataKey="count" name="Transfers" fill="#aa2d29" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Partners */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1 group">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top B2B Partners</h3>
          <div className="h-64 w-full transition-opacity group-hover:opacity-90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPartnersData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4b5563', fontWeight: 600 }} width={120} />
                <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
                <Bar dataKey="count" name="Reservations" fill="#374151" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
