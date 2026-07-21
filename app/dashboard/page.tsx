'use client';
import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const pct = (n: number, total: number) => total ? Math.round((n / total) * 100) : 0;

const PieCol = ({ data, title, border }: { data: any[]; title: string; border?: boolean }) => (
  <div className={`flex flex-col items-center justify-start py-2 ${border ? 'border-l border-r border-gray-200' : ''}`}>
    <h4 className="text-sm font-semibold text-gray-600 mb-1">{title}</h4>
    <div className="h-28 w-full hover:scale-105 transition-transform">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie>
          <Pie data={data} cx="50%" cy="50%" innerRadius={25} outerRadius={45} dataKey="value" stroke="none">
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip />
        </RechartsPie>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-col gap-1 w-full px-4 mt-6">
      {data.map(item => (
        <div key={item.name} className="flex justify-between items-center w-full">
          <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.name}</span>
          <span className="text-[10px] text-gray-500 font-medium">{item.value.toLocaleString()} ({item.percentage}%)</span>
        </div>
      ))}
    </div>
  </div>
);

const StatCard = ({ label, value, icon, bars, footer, variant }: any) => {
  const red = variant !== 'gray';
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 ${red ? 'bg-[#aa2d29]/5' : 'bg-gray-100/50'} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="font-semibold text-gray-500">{label}</span>
        <div className={`p-2 ${red ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'bg-gray-100 text-gray-600'} rounded-lg`}>{icon}</div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-3 relative z-10">{value}</div>
      <div className="mt-4 relative z-10">{footer}</div>
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

  const total = customers.length;
  const confirmed = customers.filter(c => c.status === 'Confirmed').length;
  const inTransit = customers.filter(c => c.status === 'In Transit').length;
  const recent = [...customers].reverse().slice(0, 5);

  const individual = customers.filter(c => c.customerType === 'Individual VIP').length;
  const agency = customers.filter(c => c.customerType === 'Corporate Agency').length;
  const hotel = customers.filter(c => c.customerType === 'Hotel Guest').length;
  const customerTypeData = [
    { name: 'Individual VIP', value: individual, color: '#aa2d29', percentage: pct(individual, total) },
    { name: 'Corporate Agency', value: agency, color: '#cc0000', percentage: pct(agency, total) },
    { name: 'Hotel Guest', value: hotel, color: '#e87d7b', percentage: pct(hotel, total) },
  ];

  const vt: any = { 'VIP Business Van': 0, 'Executive Sedan': 0, 'Luxury Minibus': 0, 'First Class Sedan': 0, 'Premium SUV': 0 };
  customers.forEach(c => { if (c.vehicleType && vt[c.vehicleType] !== undefined) vt[c.vehicleType]++; });
  const vehicleData = [
    { name: 'VIP Bus. Van', value: vt['VIP Business Van'], color: '#aa2d29', percentage: pct(vt['VIP Business Van'], total) },
    { name: 'Exec. Sedan', value: vt['Executive Sedan'], color: '#cc0000', percentage: pct(vt['Executive Sedan'], total) },
    { name: 'Lux. Minibus', value: vt['Luxury Minibus'], color: '#ef4444', percentage: pct(vt['Luxury Minibus'], total) },
    { name: '1st Class Sdn', value: vt['First Class Sedan'], color: '#fca5a5', percentage: pct(vt['First Class Sedan'], total) },
    { name: 'Prem. SUV', value: vt['Premium SUV'], color: '#fbe4e4', percentage: pct(vt['Premium SUV'], total) },
  ];

  const tt: any = { 'Airport Transfer': 0, 'Point to Point': 0, 'Hourly Chauffeur': 0, 'Intercity Ride': 0, 'Event Logistics': 0 };
  customers.forEach(c => { if (c.transferType && tt[c.transferType] !== undefined) tt[c.transferType]++; });
  const transferData = [
    { name: 'Airport Trsf.', value: tt['Airport Transfer'], color: '#aa2d29', percentage: pct(tt['Airport Transfer'], total) },
    { name: 'Pt to Pt', value: tt['Point to Point'], color: '#cc0000', percentage: pct(tt['Point to Point'], total) },
    { name: 'Hourly Chf.', value: tt['Hourly Chauffeur'], color: '#ef4444', percentage: pct(tt['Hourly Chauffeur'], total) },
    { name: 'Intercity', value: tt['Intercity Ride'], color: '#fca5a5', percentage: pct(tt['Intercity Ride'], total) },
    { name: 'Event Log.', value: tt['Event Logistics'], color: '#fbe4e4', percentage: pct(tt['Event Logistics'], total) },
  ];

  const pt: any = {};
  customers.forEach(c => {
    const p = c.company;
    if (p) {
      pt[p] = (pt[p] || 0) + 1;
    }
  });
  const sortedPartners = Object.entries(pt)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 6)
    .map(([name, value]: any, i) => {
      const colors = ['#aa2d29', '#cc0000', '#e87d7b', '#fca5a5', '#f8caca', '#fbe4e4'];
      return {
        name,
        value,
        color: colors[i % colors.length],
        percentage: pct(value, total)
      };
    });



  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 font-bold tracking-tight">{greeting}, <span className="text-[#aa2d29]">{name}</span></h2>
        <p className="text-gray-500 mt-1 text-base">Here's what's happening with your VIP guests today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total VIP Guests" value={total} icon={<Users className="w-6 h-6" />}
          bars={[]} footer={<p className="text-xs text-gray-400">{confirmed} confirmed · {inTransit} in transit</p>} />
        <StatCard label="Confirmed Guests" value={confirmed} icon={<CheckCircle className="w-6 h-6" />}
          bars={[]} footer={<p className="text-xs text-gray-400">{total ? Math.round((confirmed / total) * 100) : 0}% of all guests</p>} variant="gray" />
        <StatCard label="In Transit" value={inTransit} icon={<Clock className="w-6 h-6" />}
          bars={[]} footer={<p className="text-xs text-gray-400">{total ? Math.round((inTransit / total) * 100) : 0}% of all guests</p>} variant="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recently Added</h3>
          </div>
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {recent.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6"><span className="font-semibold text-gray-900 group-hover:text-[#aa2d29] transition-colors cursor-pointer">{c.firstName ? `${c.firstName} ${c.lastName}` : c.name}</span></td>
                    <td className="py-4 px-6 text-gray-500">{c.email}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        c.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        c.status === 'In Transit' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        c.status === 'Completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        c.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-gray-100 text-gray-600 border-gray-200'
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">VIP Guest Overview</h3>
          <div className="flex-1 grid grid-cols-3 gap-2 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            <PieCol data={customerTypeData} title="Guest Type" />
            <PieCol data={vehicleData} title="Vehicle Type" border />
            <PieCol data={transferData} title="Transfer Type" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 mb-8 hover:shadow-md transition-shadow">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Top B2B Partners (Agencies & Hotels)</h3>
        <div className="space-y-5">
          {sortedPartners.map(item => (
            <div key={item.name} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-36 text-sm font-semibold text-gray-700 group-hover:text-[#aa2d29] transition-colors truncate" title={item.name}>{item.name}</div>
              <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
              </div>
              <div className="w-28 text-right flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.value.toLocaleString()}</span>
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-full">{item.percentage}%</span>
              </div>
            </div>
          ))}
          {sortedPartners.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No partner data available yet.</p>}
        </div>
      </div>
    </>
  );
}
