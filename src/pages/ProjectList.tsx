import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

export default function ProjectList() {
  const projects = [
    { id: 'SI-2026-001', client: 'Sharma Residence', status: 'Active', value: 2450000, margin: 12.5 },
    { id: 'SI-2026-002', client: 'TechFlow HQ', status: 'Planning', value: 8500000, margin: 15.0 },
    { id: 'SI-2026-003', client: 'Cafe Mocha', status: 'Closing', value: 1200000, margin: 9.8 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Projects Directory</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 shadow-sm transition-colors font-medium">
          <Plus size={18} /> <span>New Project</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search projects..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <button className="text-slate-500 hover:text-slate-700 p-2 rounded-md hover:bg-slate-100">
            <Filter size={18} />
          </button>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold border-b">Project ID</th>
              <th className="p-4 font-semibold border-b">Client / Name</th>
              <th className="p-4 font-semibold border-b">Status</th>
              <th className="p-4 font-semibold border-b text-right">Contract Value</th>
              <th className="p-4 font-semibold border-b text-right">Margin %</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {projects.map((proj) => (
              <tr key={proj.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                <td className="p-4 font-bold text-blue-600">{proj.id}</td>
                <td className="p-4 font-medium text-slate-800">{proj.client}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold \${
                    proj.status === 'Active' ? 'bg-green-100 text-green-700' :
                    proj.status === 'Planning' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {proj.status}
                  </span>
                </td>
                <td className="p-4 text-right font-medium">₹{proj.value.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <span className={`font-bold \${proj.margin < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {proj.margin}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
