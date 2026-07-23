'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';


const parseDate = (dStr: string) => {
  if (!dStr) return null;
  if (dStr.includes('/')) {
    const parts = dStr.split('/');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      return isNaN(d.getTime()) ? null : d;
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

export default function AnalyticsPage() {
  const [fleetData, setFleetData] = useState<any[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<any[]>([]);
  const [topRoutesData, setTopRoutesData] = useState<any[]>([]);
  const [topPartnersData, setTopPartnersData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [kpi, setKpi] = useState<any>({ total: 0, thisMonthCount: 0, monthlyGrowth: 0, busiestDay: '-', peakHour: '-', topRoute: '-' });
  const [sparklineData, setSparklineData] = useState<any[]>([]);

  useEffect(() => {
    const customers = JSON.parse(localStorage.getItem('customersDB') || '[]');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fleet: Record<string, any> = {};
    days.forEach(d => fleet[d] = { name: d, van: 0, execSedan: 0, firstSedan: 0, suv: 0, total: 0 });

    const hours: Record<string, number> = { '00:00': 0, '04:00': 0, '08:00': 0, '12:00': 0, '16:00': 0, '20:00': 0 };
    const routes: Record<string, number> = {};
    const partners: Record<string, number> = {};
    const statuses: Record<string, number> = { 'Pending': 0, 'Confirmed': 0, 'In Transit': 0, 'Completed': 0, 'Cancelled': 0 };

    customers.forEach((c: any) => {
      // Status
      if (c.status) statuses[c.status] = (statuses[c.status] || 0) + 1;

      // Skip cancelled transfers for fleet utilization and operational metrics
      if (c.status === 'Cancelled') return;

      // Date / Fleet
      if (c.transferDate) {
        const d = parseDate(c.transferDate);
        if (d) {
          const dayName = days[d.getDay()];
          fleet[dayName].total++;
          if (c.vehicleType?.includes('Van') || c.vehicleType?.includes('Minibus')) fleet[dayName].van++;
          else if (c.vehicleType?.includes('Executive') || (c.vehicleType?.includes('Sedan') && !c.vehicleType?.includes('First'))) fleet[dayName].execSedan++;
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
    
    const statusColors: any = { 'Pending': '#9ca3af', 'Confirmed': '#10b981', 'In Transit': '#f59e0b', 'Completed': '#3b82f6', 'Cancelled': '#ef4444' };
    setStatusData(Object.entries(statuses).map(([name, value]) => ({ name, value, color: statusColors[name] || '#9ca3af' })));

    // KPI Calculations
    let maxDay = '-', maxDayVal = 0;
    Object.values(fleet).forEach(f => { if (f.total > maxDayVal) { maxDayVal = f.total; maxDay = f.name; } });
    
    let maxHour = '-', maxHourVal = 0;
    Object.entries(hours).forEach(([h, v]) => { if (v > maxHourVal) { maxHourVal = v; maxHour = h; } });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonth = lastMonthDate.getMonth();

    let thisMonthCount = 0;
    let lastMonthCount = 0;

    customers.forEach((c: any) => {
      if (c.status === 'Cancelled') return;
      if (c.transferDate) {
        const d = parseDate(c.transferDate);
        if (d) {
          if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            thisMonthCount++;
          } else if (d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth) {
            lastMonthCount++;
          }
        }
      }
    });

    let monthlyGrowth = 0;
    if (lastMonthCount > 0) {
      monthlyGrowth = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
    } else if (thisMonthCount > 0) {
      monthlyGrowth = 100;
    }

    // 6-month Sparkline data calculation
    const monthsSparkline: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      
      const count = customers.filter((c: any) => {
        if (c.status === 'Cancelled') return false;
        const cd = parseDate(c.transferDate);
        return cd && cd.getFullYear() === year && cd.getMonth() === monthIdx;
      }).length;

      monthsSparkline.push({ name: monthName, transfers: count });
    }
    setSparklineData(monthsSparkline);

    setKpi({
      total: customers.length,
      thisMonthCount,
      monthlyGrowth,
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
    <div className="pb-10 pt-2 animate-in fade-in duration-300">

      {/* KPI Cards (Bento Box) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-soft group transition-all md:col-span-2 flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monthly Volume</span>
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-6xl font-black text-gray-900 font-heading tracking-tighter mb-2">{kpi.thisMonthCount || 0}</div>
              <div className={`text-sm font-semibold flex items-center gap-1 ${
                (kpi.monthlyGrowth || 0) > 0 ? 'text-emerald-600' : (kpi.monthlyGrowth || 0) < 0 ? 'text-rose-600' : 'text-gray-500'
              }`}>
                {(kpi.monthlyGrowth || 0) > 0 ? '+' : ''}{kpi.monthlyGrowth || 0}% since last month
              </div>
            </div>

            {/* Right side: Minimal Sparkline AreaChart */}
            <div className="w-48 h-16 shrink-0 pb-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="transfers"
                    name="Transfers"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#sparklineGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft group transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Busiest Day</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-black text-gray-900 font-heading tracking-tight mb-2">{kpi.busiestDay}</div>
            <div className="text-xs font-medium text-gray-400">Peak operational day</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft group transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Peak Hour</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-black text-gray-900 font-heading tracking-tight mb-2">{kpi.peakHour}</div>
            <div className="text-xs font-medium text-gray-400">Highest traffic</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft group transition-all flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Top Pick-up</span>
          </div>
          <div className="mt-8">
            <div className="text-4xl font-black text-gray-900 font-heading tracking-tight mb-2 truncate" title={kpi.topRoute}>{kpi.topRoute}</div>
            <div className="text-xs font-medium text-gray-400">Most frequent origin</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Fleet Utilization (Col Span 2) */}
        <div className="bg-white p-8 rounded-3xl shadow-soft lg:col-span-2 group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-3">Fleet Utilization <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-widest rounded-full">Weekly</span></h3>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#aa2d29]"></span> VIP Van</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#d6413d]"></span> SUV</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4b5563]"></span> Exec.</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#111827]"></span> 1st Class</span>
            </div>
          </div>
          <div className="h-72 w-full transition-opacity group-hover:opacity-95">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="firstSedan" stackId="a" name="1st Class Sedan" fill="#111827" />
                <Bar dataKey="execSedan" stackId="a" name="Exec. Sedan" fill="#4b5563" />
                <Bar dataKey="suv" stackId="a" name="Premium SUV" fill="#d6413d" />
                <Bar dataKey="van" stackId="a" name="VIP Van" fill="#aa2d29" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Doughnut (Col Span 1) */}
        <div className="bg-white p-8 rounded-3xl shadow-soft flex flex-col group">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Transfer Status</h3>
          <p className="text-xs text-gray-400 mb-6">Current distribution</p>
          <div className="flex-1 min-h-[200px] w-full relative transition-transform group-hover:scale-105 duration-500">
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-4xl font-heading font-black text-gray-900">{kpi.total}</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Rides</span>
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
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-6">
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
        <div className="bg-white p-8 rounded-3xl shadow-soft lg:col-span-1 group">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-8">Peak Hours</h3>
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
        <div className="bg-white p-8 rounded-3xl shadow-soft lg:col-span-1 group">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-8">Frequent Routes</h3>
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
        <div className="bg-white p-8 rounded-3xl shadow-soft lg:col-span-1 group">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-8">Top B2B Partners</h3>
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
