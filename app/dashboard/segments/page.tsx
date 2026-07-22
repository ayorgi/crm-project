'use client';
import React, { useState, useEffect } from 'react';
import { Diamond, Building2, AlertTriangle, Search, Gift, Mail, ArrowRight, User, ChevronDown } from 'lucide-react';

export default function SegmentsPage() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [segmentsData, setSegmentsData] = useState<any[]>([]);
    const [sortField, setSortField] = useState<'name' | 'transfers' | 'latestTime' | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
        const grouped = new Map();

        customersDB.forEach((c: any) => {
            const id = c.email || `${c.firstName} ${c.lastName}` || c.name || c.company || 'Unknown';
            const name = `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.name || c.company || 'Unknown';
            const type = c.customerType || 'Individual';
            const date = c.transferDate ? new Date(c.transferDate) : new Date(0);
            
            if (!grouped.has(id)) {
                grouped.set(id, {
                    id: c.id || Math.random(),
                    name: name,
                    type: type,
                    company: c.company,
                    transfers: 0,
                    latestDate: date,
                    vehicles: {},
                });
            }
            
            const g = grouped.get(id);
            g.transfers += 1;
            if (date > g.latestDate) g.latestDate = date;
            if (c.vehicleType) g.vehicles[c.vehicleType] = (g.vehicles[c.vehicleType] || 0) + 1;
        });

        const computedData = Array.from(grouped.values()).map(g => {
            let segment = 'One-Time Passenger';
            const monthsSinceLastActive = (new Date().getTime() - g.latestDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

            if (g.type === 'Corporate Agency' || g.company) segment = 'Corporate';
            else if (g.transfers >= 2) segment = 'Frequent Flyer'; // 2+ for testing easily
            else if (monthsSinceLastActive >= 2 || g.latestDate.getTime() === 0) segment = 'At-Risk';

            let prefVehicle = '—';
            let maxCount = 0;
            for (const [v, count] of Object.entries(g.vehicles)) {
                if ((count as number) > maxCount) { maxCount = count as number; prefVehicle = v; }
            }

            let lastActiveStr = 'Never';
            if (g.latestDate.getTime() > 0) {
                const days = Math.floor((new Date().getTime() - g.latestDate.getTime()) / (1000 * 60 * 60 * 24));
                if (days <= 0) lastActiveStr = 'Today';
                else if (days === 1) lastActiveStr = 'Yesterday';
                else if (days < 30) lastActiveStr = `${days} Days Ago`;
                else lastActiveStr = `${Math.floor(days / 30)} Months Ago`;
            }

            return { id: g.id, name: g.name, segment, transfers: g.transfers, lastActive: lastActiveStr, vehicle: prefVehicle, latestTime: g.latestDate.getTime() };
        });

        setSegmentsData(computedData);
    }, []);

    const tabs = ['All', 'Frequent Flyer', 'Corporate', 'At-Risk', 'One-Time Passenger'];

    const handleSort = (field: 'name' | 'transfers' | 'latestTime') => {
        if (sortField !== field) {
            setSortField(field);
            setSortDir('asc');
        } else if (sortDir === 'asc') {
            setSortDir('desc');
        } else {
            setSortField(null);
        }
    };

    const filtered = segmentsData.filter(c => {
        const matchesTab = activeTab === 'All' || c.segment === activeTab;
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const sortedFiltered = [...filtered].sort((a, b) => {
        if (!sortField) return 0;
        if (sortField === 'name') {
            const cmp = a.name.localeCompare(b.name);
            return sortDir === 'asc' ? cmp : -cmp;
        }
        if (sortField === 'transfers') {
            return sortDir === 'asc' ? a.transfers - b.transfers : b.transfers - a.transfers;
        }
        if (sortField === 'latestTime') {
            return sortDir === 'asc' ? a.latestTime - b.latestTime : b.latestTime - a.latestTime;
        }
        return 0;
    });

    const stats = [
        { title: 'Frequent Flyers', count: segmentsData.filter(d => d.segment === 'Frequent Flyer').length, icon: <Diamond className="w-6 h-6 text-[#aa2d29]" />, bg: 'bg-[#aa2d29]/10', text: 'text-[#aa2d29]' },
        { title: 'Corporate Clients', count: segmentsData.filter(d => d.segment === 'Corporate').length, icon: <Building2 className="w-6 h-6 text-gray-700" />, bg: 'bg-gray-100', text: 'text-gray-800' },
        { title: 'At-Risk Customers', count: segmentsData.filter(d => d.segment === 'At-Risk').length, icon: <AlertTriangle className="w-6 h-6 text-amber-500" />, bg: 'bg-amber-50', text: 'text-amber-700' },
        { title: 'One-Time Passengers', count: segmentsData.filter(d => d.segment === 'One-Time Passenger').length, icon: <User className="w-6 h-6 text-fuchsia-500" />, bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' },
    ];

    const getSegmentBadge = (segment: string) => {
        switch (segment) {
            case 'Frequent Flyer': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#aa2d29]/10 text-[#aa2d29] border border-[#aa2d29]/20"><Diamond className="w-3 h-3" /> Frequent Flyer</span>;
            case 'Corporate': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200"><Building2 className="w-3 h-3" /> Corporate</span>;
            case 'At-Risk': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3 h-3" /> At-Risk</span>;
            case 'One-Time Passenger': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200"><User className="w-3 h-3" /> One-Time Passenger</span>;
            default: return null;
        }
    };

    const renderSortHeader = (label: string, field: 'name' | 'transfers' | 'latestTime') => {
        const isCurrent = sortField === field;
        return (
            <button onClick={() => handleSort(field)} className="flex items-center gap-1.5 hover:text-gray-700 transition-colors group">
                <span>{label}</span>
                <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${isCurrent && sortDir === 'asc' ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                    <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${isCurrent && sortDir === 'desc' ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                </span>
            </button>
        );
    };


    return (
        <div className="pb-10 animate-in fade-in duration-300">
            <div className="mb-10">
                <h2 className="text-4xl text-gray-900 font-heading font-bold tracking-tight">Passenger Segments</h2>
                <p className="text-gray-500 mt-2 text-lg">Smart segmentation based on flight frequency, spending, and risk profile.</p>
            </div>

            {/* Stats (Bento Box) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                {stats.map(s => (
                    <div key={s.title} className="bg-white p-8 rounded-3xl shadow-soft flex flex-col justify-between group">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.title}</p>
                        </div>
                        <div className="mt-8">
                            <p className={`text-6xl font-heading font-black tracking-tighter ${s.text}`}>{s.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Area */}
            <div className="bg-white rounded-3xl shadow-soft overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="flex bg-gray-200/50 p-1 rounded-xl w-full md:w-auto">
                        {tabs.map(t => (
                            <button key={t} onClick={() => setActiveTab(t)}
                                className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search passenger..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#aa2d29] focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-white">
                                <th className="py-4 px-6">{renderSortHeader('PASSENGER / PARTNER', 'name')}</th>
                                <th className="py-4 px-6">SEGMENT</th>
                                <th className="py-4 px-6">{renderSortHeader('TOTAL TRANSFERS', 'transfers')}</th>
                                <th className="py-4 px-6">{renderSortHeader('LAST ACTIVE', 'latestTime')}</th>
                                <th className="py-4 px-6">PREFERRED VEHICLE</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {sortedFiltered.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-gray-400 font-medium">No passengers found in this segment.</td></tr>
                            ) : sortedFiltered.slice(0, visibleCount).map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors group">
                                    <td className="py-4 px-6 font-bold text-gray-900">{c.name}</td>
                                    <td className="py-4 px-6">{getSegmentBadge(c.segment)}</td>
                                    <td className="py-4 px-6 font-semibold">{c.transfers} <span className="text-gray-400 font-medium text-xs">rides</span></td>
                                    <td className="py-4 px-6 text-gray-500">{c.lastActive}</td>
                                    <td className="py-4 px-6 text-gray-500">{c.vehicle}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedFiltered.length > visibleCount && (
                    <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 10)}
                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group"
                        >
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            Show More (+{sortedFiltered.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
