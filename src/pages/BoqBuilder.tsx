import React, { useState } from 'react';
import { Plus, AlertCircle, Calculator, ShieldAlert } from 'lucide-react';
import { STANDARD_WASTAGE, MATERIAL_TYPES } from '../data/constants';
import { useAppStore } from '../store/AppProvider';

export default function BoqBuilder() {
  const { data, activeProjectId, addBoqItem } = useAppStore();
  const boqItems = data.boqs.filter((b: any) => b.projectId === activeProjectId);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ desc: '', material: 'Plywood', qty: 0, rate: 0, wastage: 5, flagMdApproval: false, mdJustification: '' });

  const bounds = STANDARD_WASTAGE[newItem.material] || { min: 0, max: 0 };
  const requiresOverride = newItem.wastage > bounds.max;
  const canSave = !requiresOverride || (newItem.flagMdApproval && newItem.mdJustification.length > 5);

  const handleSave = () => {
    if (canSave) {
      addBoqItem({
        id: Date.now(),
        projectId: activeProjectId,
        ...newItem
      });
      setIsAdding(false);
      setNewItem({ desc: '', material: 'Plywood', qty: 0, rate: 0, wastage: 5, flagMdApproval: false, mdJustification: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">BOQ & Wastage Calculator</h2>
          <p className="text-sm text-slate-500 mt-1">SOP Sections 5 & 6 Controls</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-emerald-700 shadow-md font-semibold transition-all">
          <Plus size={18} /> <span>Add BOQ Line</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-emerald-100 mb-6 transition-all">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Calculator size={18} className="mr-2 text-emerald-600"/> Add New BOQ Item</h3>
          
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
              <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-emerald-500" value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Material</label>
              <select className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-emerald-500 bg-white" value={newItem.material} onChange={e => setNewItem({...newItem, material: e.target.value, wastage: STANDARD_WASTAGE[e.target.value].min})}>
                {MATERIAL_TYPES.map(m => <option key={m} value={m}>{m} (Max {STANDARD_WASTAGE[m].max}%)</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Qty</label>
              <input type="number" className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-emerald-500" value={newItem.qty || ''} onChange={e => setNewItem({...newItem, qty: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Rate (₹)</label>
              <input type="number" className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-emerald-500" value={newItem.rate || ''} onChange={e => setNewItem({...newItem, rate: Number(e.target.value)})} />
            </div>
          </div>

          <div className="flex space-x-6 items-start">
            <div className="w-48">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Wastage %</label>
              <input type="number" className={`w-full border rounded p-2 focus:ring-2 font-bold ${requiresOverride ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-300 focus:ring-emerald-500'}`} value={newItem.wastage || ''} onChange={e => setNewItem({...newItem, wastage: Number(e.target.value)})} />
            </div>
            
            {requiresOverride && (
              <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start mb-3">
                  <ShieldAlert className="text-red-600 mr-2 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-red-800">SOP Limit Exceeded</h4>
                    <p className="text-sm text-red-700">The entered wastage ({newItem.wastage}%) exceeds the SOP ceiling ({bounds.max}%) for {newItem.material}. You must provide a justification and flag this for MD Approval.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-bold text-red-800">
                    <input type="checkbox" checked={newItem.flagMdApproval} onChange={e => setNewItem({...newItem, flagMdApproval: e.target.checked})} className="rounded text-red-600 focus:ring-red-500 w-4 h-4" />
                    <span>Flag for MD Approval (Required)</span>
                  </label>
                  {newItem.flagMdApproval && (
                    <textarea 
                      placeholder="Enter justification for high wastage..." 
                      className="w-full text-sm border-red-300 rounded p-2 focus:ring-2 focus:ring-red-500 bg-white" 
                      rows={2}
                      value={newItem.mdJustification}
                      onChange={e => setNewItem({...newItem, mdJustification: e.target.value})}
                    ></textarea>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 border-t border-slate-100 pt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!canSave} className={`px-4 py-2 rounded-lg font-bold shadow-sm transition-all ${canSave ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>Save to BOQ</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Material Spec</th>
              <th className="p-4 font-semibold text-right">Qty</th>
              <th className="p-4 font-semibold text-right">Unit Rate (₹)</th>
              <th className="p-4 font-semibold text-center">Wastage %</th>
              <th className="p-4 font-semibold text-right">Total Budget</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {boqItems.map((item: any) => {
              const boundsItem = STANDARD_WASTAGE[item.material] || { min: 0, max: 0 };
              const isHigh = item.wastage > boundsItem.max;
              const totalCost = item.qty * item.rate * (1 + item.wastage / 100);

              return (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{item.desc}</td>
                  <td className="p-4 text-slate-600">{item.material}</td>
                  <td className="p-4 text-right font-bold text-slate-700">{item.qty}</td>
                  <td className="p-4 text-right font-bold text-slate-700">{item.rate.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex flex-col items-center">
                      <span className={`px-3 py-1 rounded-full font-bold ${isHigh ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'}`}>{item.wastage}%</span>
                      {isHigh && (
                        <div className="flex items-center text-red-600 text-xs font-bold mt-1" title={item.mdJustification}>
                          <AlertCircle size={12} className="mr-1" /> MD Approval
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right font-bold text-slate-800 text-base">
                    ₹{totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center space-x-6 text-sm">
          <div className="text-slate-500 flex items-center"><Calculator size={16} className="mr-2"/> Formula: Qty * Rate * (1 + Wastage)</div>
          <div className="font-bold text-lg text-slate-800">
            Total Material Budget: <span className="text-emerald-700">₹{boqItems.reduce((acc: number, curr: any) => acc + (curr.qty * curr.rate * (1 + curr.wastage / 100)), 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
