import { useState, useEffect } from 'react';
import { Search, Download, Filter, MoreHorizontal } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Customers</h1>
          <p className="text-slate-500 text-sm">Manage your WhatsApp contacts and segments.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-100 flex items-center gap-2 shadow-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100/50 rounded-t-2xl">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or tag..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#F97316]/50 focus:border-[#F97316] outline-none" 
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100">
            <Filter size={16} /> Filter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-100/50 transition-colors group">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-blue-700 font-bold border border-blue-200/50">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{c.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-xs">{c.phone}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {c.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-md text-[11px] font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">Today, 10:42 AM</td>
                  <td className="p-4 text-right pr-6">
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
