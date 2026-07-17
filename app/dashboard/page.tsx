'use client';
import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const pct = (n: number, total: number) => total ? Math.round((n / total) * 100) : 0;

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
  const active = customers.filter(c => c.status === 'Active').length;
  const inactive = customers.filter(c => c.status === 'Inactive').length;
  const recent = [...customers].reverse().slice(0, 5);

  const male = customers.filter(c => c.gender === 'Male').length;
  const female = customers.filter(c => c.gender === 'Female').length;
  const genderData = [
    { name: 'Male', value: male, color: '#aa2d29', percentage: pct(male, total) },
    { name: 'Female', value: female, color: '#e87d7b', percentage: pct(female, total) },
  ];

  const ag: any = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };
  customers.forEach(c => {
    const a = parseInt(c.age);
    if (a <= 25) ag['18-25']++;
    else if (a <= 35) ag['26-35']++;
    else if (a <= 45) ag['36-45']++;
    else if (a <= 55) ag['46-55']++;
    else if (a >= 56) ag['56+']++;
  });
  const ageData = [
    { name: '18-25', value: ag['18-25'], color: '#fbe4e4', percentage: pct(ag['18-25'], total) },
    { name: '26-35', value: ag['26-35'], color: '#fca5a5', percentage: pct(ag['26-35'], total) },
    { name: '36-45', value: ag['36-45'], color: '#ef4444', percentage: pct(ag['36-45'], total) },
    { name: '46-55', value: ag['46-55'], color: '#cc0000', percentage: pct(ag['46-55'], total) },
    { name: '56+', value: ag['56+'], color: '#aa2d29', percentage: pct(ag['56+'], total) },
  ];

  const lg: any = { Turkish: 0, English: 0, Greek: 0, Russian: 0 };
  customers.forEach(c => { if (c.language && lg[c.language] !== undefined) lg[c.language]++; });
  const languageData = [
    { name: 'Turkish', value: lg.Turkish, color: '#aa2d29', percentage: pct(lg.Turkish, total) },
    { name: 'English', value: lg.English, color: '#cc0000', percentage: pct(lg.English, total) },
    { name: 'Greek', value: lg.Greek, color: '#e87d7b', percentage: pct(lg.Greek, total) },
    { name: 'Russian', value: lg.Russian, color: '#fca5a5', percentage: pct(lg.Russian, total) },
  ];

  const ct: any = { Lefkoşa: 0, Girne: 0, Gazimağusa: 0, İskele: 0, Güzelyurt: 0, Lefke: 0 };
  customers.forEach(c => { if (c.city && ct[c.city] !== undefined) ct[c.city]++; });
  const locationData = [
    { name: 'Lefkoşa', value: ct.Lefkoşa, color: '#aa2d29', percentage: pct(ct.Lefkoşa, total) },
    { name: 'Girne', value: ct.Girne, color: '#cc0000', percentage: pct(ct.Girne, total) },
    { name: 'Gazimağusa', value: ct.Gazimağusa, color: '#e87d7b', percentage: pct(ct.Gazimağusa, total) },
    { name: 'İskele', value: ct.İskele, color: '#fca5a5', percentage: pct(ct.İskele, total) },
    { name: 'Güzelyurt', value: ct.Güzelyurt, color: '#f8caca', percentage: pct(ct.Güzelyurt, total) },
    { name: 'Lefke', value: ct.Lefke, color: '#fbe4e4', percentage: pct(ct.Lefke, total) },
  ];

  const PieCol = ({ data, title, border }: { data: typeof genderData; title: string; border?: boolean }) => (
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

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 font-bold tracking-tight">{greeting}, <span className="text-[#aa2d29]">{name}</span></h2>
        <p className="text-gray-500 mt-1 text-base">Here's what's happening with your customers today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Customers" value={total} icon={<Users className="w-6 h-6" />}
          bars={[]} footer={<p className="text-xs text-gray-400">{active} active · {inactive} inactive</p>} />
        <StatCard label="Active Customers" value={active} icon={<CheckCircle className="w-6 h-6" />}
          bars={[]} footer={<p className="text-xs text-gray-400">{total ? Math.round((active / total) * 100) : 0}% of all customers</p>} variant="gray" />
        <StatCard label="Inactive Customers" value={inactive} icon={<XCircle className="w-6 h-6" />}
          bars={[]} footer={<p className="text-xs text-gray-400">{total ? Math.round((inactive / total) * 100) : 0}% of all customers</p>} variant="gray" />
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td colSpan={3} className="py-12 px-6 text-center text-gray-500">No customers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4">Customer Overview</h3>
          <div className="flex-1 grid grid-cols-3 gap-2 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
            <PieCol data={genderData} title="Gender" />
            <PieCol data={ageData} title="Age" border />
            <PieCol data={languageData} title="Language" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 mb-8 hover:shadow-md transition-shadow">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Customers by City</h3>
        <div className="space-y-5">
          {locationData.map(item => (
            <div key={item.name} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-24 text-sm font-semibold text-gray-700 group-hover:text-[#aa2d29] transition-colors">{item.name}</div>
              <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
              </div>
              <div className="w-28 text-right flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.value.toLocaleString()}</span>
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-full">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
