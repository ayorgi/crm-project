'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, Info, Pencil, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CITIES = ['Lefkoşa', 'Girne', 'Gazimağusa', 'İskele', 'Güzelyurt', 'Lefke'];
const EMPTY = { firstName: '', lastName: '', email: '', phone: '', company: '', gender: '', age: '', language: '', city: '', address: '', status: '' };
type Form = typeof EMPTY;

const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {children}
    </div>
);

function CustomerForm({ value: v, onChange: set, onSave, onCancel, saveLabel }: {
    value: Form; onChange: (k: string, val: string) => void; onSave: () => void; onCancel: () => void; saveLabel: string;
}) {
    const inp = "w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-1 focus:ring-[#aa2d29] outline-none transition-all text-gray-900";
    const cityRe = new RegExp(`(,\\s*)?(${CITIES.join('|')}),\\s*KKTC$`);

    const onCity = (city: string) => {
        set('city', city);
        const addr = v.address.trim();
        if (!addr) set('address', `${city}, KKTC`);
        else if (cityRe.test(addr)) set('address', addr.replace(cityRe, `, ${city}, KKTC`).replace(/^,\s*/, ''));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <F label="First Name"><input type="text" placeholder="e.g. Asrın" value={v.firstName} onChange={e => set('firstName', e.target.value)} className={inp} /></F>
            <F label="Last Name"><input type="text" placeholder="e.g. Şahin" value={v.lastName} onChange={e => set('lastName', e.target.value)} className={inp} /></F>
            <F label="Email Address"><input type="email" placeholder="asrinsahin@example.com" value={v.email} onChange={e => set('email', e.target.value)} className={inp} /></F>
            <F label="Phone Number"><input type="text" placeholder="+90 555 000 00 00" value={v.phone} onChange={e => set('phone', e.target.value)} className={inp} /></F>
            <F label="Company"><input type="text" placeholder="e.g. Near East Ltd." value={v.company} onChange={e => set('company', e.target.value)} className={inp} /></F>
            <F label="Status">
                <Select value={v.status} onValueChange={val => set('status', val || '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </F>
            <F label="Gender">
                <Select value={v.gender} onValueChange={val => set('gender', val || '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </F>
            <F label="Age">
                <input type="number" placeholder="e.g. 34" min="18" max="100" value={v.age}
                    onKeyDown={e => { if (!['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) e.preventDefault(); }}
                    onChange={e => { const n = parseInt(e.target.value); if (e.target.value === '' || n >= 18) set('age', e.target.value); }} className={inp} />
            </F>
            <F label="Language">
                <Select value={v.language} onValueChange={val => set('language', val || '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {['Turkish', 'English', 'Greek', 'Russian'].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </F>
            <F label="City">
                <Select value={v.city} onValueChange={val => onCity(val || '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </F>
            <div className="md:col-span-2">
                <F label="Address"><input type="text" placeholder="e.g. Atatürk Cad. No:5, Lefkoşa, KKTC" value={v.address} onChange={e => set('address', e.target.value)} className={inp} /></F>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100 mt-3">
                <button onClick={onCancel} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={onSave} className="bg-gray-900 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">{saveLabel}</button>
            </div>
        </div>
    );
}
function ConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Customer</h3>
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete <span className="font-semibold text-gray-800">{name}</span>? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    );
}

function DetailPanel({ c, onClose }: { c: any; onClose: () => void }) {
    const fields = [
        ['Full Name', c.firstName ? `${c.firstName} ${c.lastName}` : c.name],
        ['Email', c.email], ['Phone', c.phone], ['Company', c.company],
        ['Status', c.status], ['Gender', c.gender], ['Age', c.age],
        ['Language', c.language], ['City', c.city], ['Address', c.address],
        ['Created At', c.createdAt || new Date(c.id).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })],
    ].filter(([, val]) => val);
    return (
        <tr>
            <td colSpan={5} className="px-6 py-5 bg-gray-50/70 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-bold text-gray-800">Customer Details</p>
                    <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                    {fields.map(([label, val]) => (
                        <div key={label} className="flex gap-2 text-sm">
                            <span className="w-28 text-gray-400 shrink-0">{label}</span>
                            <span className="text-gray-800 font-medium">{val}</span>
                        </div>
                    ))}
                </div>
            </td>
        </tr>
    );
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ ...EMPTY });
    const [editId, setEditId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ ...EMPTY });
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [detailId, setDetailId] = useState<number | null>(null);
    const [sortAsc, setSortAsc] = useState<boolean | null>(null);

    useEffect(() => {
        setCustomers(JSON.parse(localStorage.getItem('customersDB') || '[]'));
    }, []);

    const persist = (list: any[]) => { setCustomers(list); localStorage.setItem('customersDB', JSON.stringify(list)); };
    const setF = (form: any, setForm: (f: any) => void) => (k: string, val: string) => setForm((p: any) => ({ ...p, [k]: val }));

    const handleAdd = () => {
        if (!addForm.firstName || !addForm.lastName || !addForm.email) return;
        const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        persist([...customers, { ...addForm, id: Date.now(), createdAt: today }]);
        setAddForm({ ...EMPTY }); setShowAdd(false);
    };

    const startEdit = (c: any) => {
        if (editId === c.id) { setEditId(null); return; }
        setEditId(c.id); setEditForm({ ...EMPTY, ...c }); setDetailId(null); setShowAdd(false);
    };

    const handleEditSave = () => {
        if (!editForm.firstName || !editForm.lastName || !editForm.email) return;
        persist(customers.map(c => c.id === editId ? { ...editForm, id: editId } : c));
        setEditId(null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        persist(customers.filter(c => c.id !== deleteTarget.id));
        if (editId === deleteTarget.id) setEditId(null);
        if (detailId === deleteTarget.id) setDetailId(null);
        setDeleteTarget(null);
    };

    const fullName = (c: any) => c.firstName ? `${c.firstName} ${c.lastName}` : c.name;
    const filtered = customers.filter(c => {
        const name = c.firstName ? `${c.firstName} ${c.lastName}` : c.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
    }).sort((a, b) => {
        if (sortAsc === null) return 0;
        const na = fullName(a)?.toLowerCase() ?? '';
        const nb = fullName(b)?.toLowerCase() ?? '';
        return sortAsc ? na.localeCompare(nb) : nb.localeCompare(na);
    });

    return (
        <div className="pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl text-gray-900 font-bold tracking-tight">Customers</h2>
                    <p className="text-gray-500 mt-1 text-base">Manage customers.</p>
                </div>
                <button onClick={() => { setShowAdd(true); setEditId(null); }}
                    className="bg-[#aa2d29] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#8e2622] transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Plus className="w-5 h-5" />
                    <span>Add Customer</span>
                </button>
            </div>

            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-7 border-b border-gray-100 pb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Add New Customer</h3>
                                <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new customer.</p>
                            </div>
                            <button onClick={() => {
                                setShowAdd(false); setAddForm({ ...EMPTY });
                            }} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <CustomerForm value={addForm} onChange={setF(addForm, setAddForm)} onSave={handleAdd}
                            onCancel={() => { setShowAdd(false); setAddForm({ ...EMPTY }); }} saveLabel="Save Customer" />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#aa2d29] focus:ring-1 focus:ring-[#aa2d29] outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                                <th className="py-3.5 px-6">
                                    <button onClick={() => setSortAsc(p => p === true ? false : p === false ? null : true)}
                                        className="flex items-center gap-1.5 hover:text-gray-800 transition-colors group">
                                        <span>FULL NAME</span>
                                        <span className="flex flex-col gap-[1px] opacity-50 group-hover:opacity-100 transition-opacity">
                                            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent ${sortAsc === true ? 'border-b-[#aa2d29]' : 'border-b-gray-400'}`} />
                                            <span className={`w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent ${sortAsc === false ? 'border-t-[#aa2d29]' : 'border-t-gray-400'}`} />
                                        </span>
                                    </button>
                                </th>
                                <th className="py-3.5 px-6">Phone</th>
                                <th className="py-3.5 px-6">Email</th>
                                <th className="py-3.5 px-6 text-center">Status</th>
                                <th className="py-3.5 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                            {filtered.map(c => (
                                <React.Fragment key={c.id}>
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-gray-900">{fullName(c)}</td>
                                        <td className="py-4 px-6 text-gray-500">{c.phone || '—'}</td>
                                        <td className="py-4 px-6 text-gray-500">{c.email}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{c.status}</span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => { setDetailId(p => p === c.id ? null : c.id); setEditId(null); }} title="Detail" className={`p-1.5 rounded-md transition-colors ${detailId === c.id ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}><Info className="w-4 h-4" /></button>
                                                <button onClick={() => startEdit(c)} title="Edit" className={`p-1.5 rounded-md transition-colors ${editId === c.id ? 'bg-[#aa2d29]/10 text-[#aa2d29]' : 'text-gray-400 hover:bg-[#aa2d29]/10 hover:text-[#aa2d29]'}`}><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => setDeleteTarget(c)} title="Delete" className="p-1.5 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                    {detailId === c.id && <DetailPanel key={`d-${c.id}`} c={c} onClose={() => setDetailId(null)} />}
                                </React.Fragment>
                            ))}
                            {filtered.length === 0 && <tr><td colSpan={5} className="py-14 text-center text-gray-400 text-sm">No customers found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            {editId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-7 border-b border-gray-100 pb-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Edit Customer</h3>
                                <p className="text-sm text-gray-500 mt-1">Update the details below and save your changes.</p>
                            </div>
                            <button onClick={() => setEditId(null)} className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <CustomerForm value={editForm} onChange={setF(editForm, setEditForm)} onSave={handleEditSave} onCancel={() => setEditId(null)} saveLabel="Save Changes" />
                    </div>
                </div>
            )}
            {deleteTarget && <ConfirmModal name={fullName(deleteTarget)} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />}
        </div>
    );
}