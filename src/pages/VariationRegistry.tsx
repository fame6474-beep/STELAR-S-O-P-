import React, { useState } from 'react';
import { Plus, Check, X, Clock, FilePlus2, IndianRupee } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export default function VariationRegistry() {
  const { data, activeProjectId, updateVariationStatus, addVariation } = useAppStore();
  const variations = data.variations.filter((v: any) => v.projectId === activeProjectId);

  const [isAdding, setIsAdding] = useState(false);
  const [newVar, setNewVar] = useState({ desc: '', category: 'Finishes', material: 'Plywood', qty: 0, rate: 0, wastage: 5 });

  const handleAdd = () => {
    addVariation({
      id: `VO-2026-00\${data.variations.length + 1}`,
      projectId: activeProjectId,
      ...newVar,
      status: 'Draft',
      additionalValue: newVar.qty * newVar.rate * (1 + newVar.wastage/100)
    });
    setIsAdding(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Variation Orders Registry</h2>
          <p className="text-sm text-slate-500 mt-1">Addendum Scope & Client Approvals</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 shadow-md font-semibold transition-all">
          <FilePlus2 size={18} /> <span>New Variation</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-emerald-100 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">Draft New Addendum</h3>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <input type="text" placeholder="Description" className="col-span-2 border rounded p-2 focus:ring-2 focus:ring-emerald-500" onChange={e => setNewVar({...newVar, desc: e.target.value})} />
            <select className="border rounded p-2 focus:ring-2 focus:ring-emerald-500" onChange={e => setNewVar({...newVar, category: e.target.value})}>
              <option>Finishes</option><option>Gypsum Works</option><option>MEP</option>
            </select>
            <input type="number" placeholder="Qty" className="border rounded p-2 focus:ring-2 focus:ring-emerald-500" onChange={e => setNewVar({...newVar, qty: Number(e.target.value)})} />
            <input type="number" placeholder="Rate (₹)" className="border rounded p-2 focus:ring-2 focus:ring-emerald-500" onChange={e => setNewVar({...newVar, rate: Number(e.target.value)})} />
            <input type="number" placeholder="Wastage %" className="border rounded p-2 focus:ring-2 focus:ring-emerald-500" onChange={e => setNewVar({...newVar, wastage: Number(e.target.value)})} defaultValue={5} />
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700">Save Draft</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {variations.map((v: any) => {
          const val = v.additionalValue || (v.qty * v.rate * (1 + v.wastage/100));
          
          return (
            <div key={v.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-5 flex justify-between items-center transition-all ${
              v.status === 'Client Approved' ? 'border-l-emerald-500' :
              v.status === 'Submitted' ? 'border-l-blue-500' :
              v.status === 'Rejected' ? 'border-l-red-500' : 'border-l-slate-300'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-slate-800 text-lg">{v.id}</h3>
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    v.status === 'Client Approved' ? 'bg-emerald-100 text-emerald-700' :
                    v.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                    v.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>{v.status}</span>
                </div>
                <p className="text-slate-600 font-medium">{v.desc}</p>
                <p className="text-xs text-slate-400">Category: {v.category} | Material: {v.material} | Qty: {v.qty} @ ₹{v.rate} (+{v.wastage}% wastage)</p>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="flex items-center space-x-1 text-slate-800 font-bold text-xl mb-3">
                  <IndianRupee size={18} className="text-slate-500" />
                  <span>{val.toLocaleString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  {v.status === 'Draft' && (
                    <button onClick={() => updateVariationStatus(v.id, 'Submitted')} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md font-semibold flex items-center">
                      <Clock size={14} className="mr-1" /> Submit to Client
                    </button>
                  )}
                  {v.status === 'Submitted' && (
                    <>
                      <button onClick={() => updateVariationStatus(v.id, 'Client Approved')} className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-md font-semibold flex items-center">
                        <Check size={14} className="mr-1" /> Approve
                      </button>
                      <button onClick={() => updateVariationStatus(v.id, 'Rejected')} className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-md font-semibold flex items-center">
                        <X size={14} className="mr-1" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
