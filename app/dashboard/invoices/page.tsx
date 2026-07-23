'use client';
import React, { useState, useEffect } from 'react';
import { Receipt, DollarSign, Clock, CheckCircle2, Download, Search, Filter, AlertCircle, Building2, User, ChevronDown } from 'lucide-react';
import { getVehiclePrice } from '@/lib/utils';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const customersDB = JSON.parse(localStorage.getItem('customersDB') || '[]');
    
    // Group rides by Company (if B2B) or Email/Name (if Individual)
    const grouped = new Map();

    customersDB.forEach((c: any) => {
      if (c.status === 'Cancelled') return;
      const isB2B = c.customerType === 'Corporate Agency';
      const billToId = isB2B && c.company ? c.company : c.email || `${c.firstName} ${c.lastName}`;
      const billToName = isB2B && c.company ? c.company : `${c.firstName} ${c.lastName}`;
      
      const price = getVehiclePrice(c.vehicleType);
      
      if (!grouped.has(billToId)) {
        grouped.set(billToId, {
          id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
          billTo: billToName,
          isB2B,
          totalAmount: 0,
          ridesCount: 0,
          dueDate: new Date(c.transferDate), // Just use first transfer date as a mock due date base
          status: 'Pending',
          latestRideDate: new Date(0),
        });
      }
      
      const g = grouped.get(billToId);
      g.totalAmount += price;
      g.ridesCount += 1;
      
      const rideDate = new Date(c.transferDate);
      if (rideDate > g.latestRideDate) {
        g.latestRideDate = rideDate;
      }
    });

    const computedInvoices = Array.from(grouped.values()).map((inv: any, idx: number) => {
      // Logic for status
      const now = new Date();
      // If the latest ride was more than 30 days ago, it's paid or overdue
      const daysSinceLatest = (now.getTime() - inv.latestRideDate.getTime()) / (1000 * 60 * 60 * 24);
      
      let status = 'Pending';
      if (daysSinceLatest > 60) status = 'Overdue';
      else if (daysSinceLatest > 15 && daysSinceLatest <= 60) status = 'Paid';
      else if (daysSinceLatest < 0) status = 'Pending'; // future

      // Add random fuzziness to status so it looks like a real CRM
      if (idx % 5 === 0) status = 'Overdue';
      if (idx % 3 === 0 && status !== 'Overdue') status = 'Paid';

      return {
        ...inv,
        status,
        dateFormatted: inv.latestRideDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    });

    // Sort by largest amount first
    computedInvoices.sort((a, b) => b.totalAmount - a.totalAmount);
    setInvoices(computedInvoices);
  }, []);

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((acc, inv) => acc + inv.totalAmount, 0);

  const [sortField, setSortField] = useState<'billTo' | 'ridesCount' | 'date' | 'totalAmount' | 'status' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'billTo' | 'ridesCount' | 'date' | 'totalAmount' | 'status') => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortField(null);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.billTo.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortField) return 0;
    if (sortField === 'billTo') {
      const cmp = a.billTo.localeCompare(b.billTo);
      return sortDir === 'asc' ? cmp : -cmp;
    }
    if (sortField === 'ridesCount') {
      return sortDir === 'asc' ? a.ridesCount - b.ridesCount : b.ridesCount - a.ridesCount;
    }
    if (sortField === 'date') {
      const tA = a.latestRideDate ? new Date(a.latestRideDate).getTime() : 0;
      const tB = b.latestRideDate ? new Date(b.latestRideDate).getTime() : 0;
      return sortDir === 'asc' ? tA - tB : tB - tA;
    }
    if (sortField === 'totalAmount') {
      return sortDir === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
    }
    if (sortField === 'status') {
      const cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    }
    return 0;
  });

  const renderSortHeader = (label: string, field: 'billTo' | 'ridesCount' | 'date' | 'totalAmount' | 'status', alignRight = false, alignCenter = false) => {
    const isCurrent = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={`flex items-center gap-1.5 hover:text-gray-700 transition-colors group ${
          alignRight ? 'ml-auto justify-end' : alignCenter ? 'mx-auto justify-center' : ''
        }`}
      >
        <span>{label}</span>
        <span className="flex flex-col gap-[1px] opacity-40 group-hover:opacity-100 transition-opacity">
          <span
            className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent ${
              isCurrent && sortDir === 'asc' ? 'border-b-[#aa2d29]' : 'border-b-gray-400'
            }`}
          />
          <span
            className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${
              isCurrent && sortDir === 'desc' ? 'border-t-[#aa2d29]' : 'border-t-gray-400'
            }`}
          />
        </span>
      </button>
    );
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(invoices, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoices_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (inv: any) => {
    const dataStr = JSON.stringify(inv, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${inv.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-10 pt-2 animate-in fade-in duration-300">
      <div className="mb-6 flex justify-end">
        <button onClick={handleExportAll} className="bg-[#aa2d29] hover:bg-[#8a2421] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-[#aa2d29]/20 transition-all flex items-center gap-2 text-sm shrink-0">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Projected Revenue</span>
          </div>
          <div className="mt-8">
            <div className="text-5xl font-black text-gray-900 font-heading tracking-tight mb-2">${totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500 font-medium">Accumulated across all transfers</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pending Collection</span>
          </div>
          <div className="mt-8">
            <div className="text-5xl font-black text-amber-600 font-heading tracking-tight mb-2">${pendingAmount.toLocaleString()}</div>
            <div className="text-xs text-amber-700/80 font-medium">Awaiting payment settlement</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Overdue Invoices</span>
          </div>
          <div className="mt-8">
            <div className="text-5xl font-black text-red-600 font-heading tracking-tight mb-2">${overdueAmount.toLocaleString()}</div>
            <div className="text-xs text-red-600/80 font-medium">Requires immediate follow-up</div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100/80 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by client or invoice ID..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50/60 border border-gray-200/80 rounded-xl text-sm focus:border-[#aa2d29] focus:bg-white focus:ring-2 focus:ring-[#aa2d29]/20 outline-none transition-all text-gray-900 placeholder:text-gray-400" 
            />
          </div>
          <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto">
            {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 md:flex-none ${
                  statusFilter === s ? 'bg-[#aa2d29] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/70">
                <th className="py-4 px-6">INVOICE ID</th>
                <th className="py-4 px-6">{renderSortHeader('BILLED TO', 'billTo')}</th>
                <th className="py-4 px-6">{renderSortHeader('RIDES', 'ridesCount')}</th>
                <th className="py-4 px-6">{renderSortHeader('DATE GENERATED', 'date')}</th>
                <th className="py-4 px-6 text-right">{renderSortHeader('AMOUNT', 'totalAmount', true)}</th>
                <th className="py-4 px-6 text-center">{renderSortHeader('STATUS', 'status', false, true)}</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              {sortedInvoices.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 font-medium">No invoices match your criteria.</td></tr>
              ) : sortedInvoices.slice(0, visibleCount).map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-500">{inv.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${inv.isB2B ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                        {inv.isB2B ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-gray-900">{inv.billTo}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-medium">{inv.ridesCount} rides</td>
                  <td className="py-4 px-6 text-gray-500">{inv.dateFormatted}</td>
                  <td className="py-4 px-6 text-right font-black text-gray-900">${inv.totalAmount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' :
                      inv.status === 'Overdue' ? 'bg-red-50 text-red-600 border border-red-200/60' :
                      'bg-gray-100 text-gray-600 border border-gray-200/60'
                    }`}>
                      {inv.status === 'Paid' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {inv.status === 'Overdue' && <AlertCircle className="w-3 h-3 text-red-600" />}
                      {inv.status === 'Pending' && <Clock className="w-3 h-3 text-gray-500" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleDownloadInvoice(inv)} className="text-gray-400 hover:text-[#aa2d29] transition-colors p-2 rounded-lg hover:bg-[#aa2d29]/10">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedInvoices.length > visibleCount && (
          <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-2 group"
            >
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              Show More (+{sortedInvoices.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
