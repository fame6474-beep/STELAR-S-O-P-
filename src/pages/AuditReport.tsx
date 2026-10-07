import React from 'react';
import { Printer, Check, IndianRupee, RotateCcw } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';
import { STANDARD_ALLOCATION } from '../data/constants';

export default function AuditReport() {
  const { data, activeProjectId, getProjectTotal, updateSalvageValue } = useAppStore();
  const proj = data.projects.find((p:any) => p.id === activeProjectId);
  const projectTotal = getProjectTotal(activeProjectId);
  const billingData = data.billing[activeProjectId] || { salvageValue: 0, retention: { amount: 0, releaseDate: '-', status: 'N/A' } };
  
  const currentActuals = {
    materials: 1100000,
    site_labour: data.labour[activeProjectId]?.siteActual || 320000,
    factory_labour: data.labour[activeProjectId]?.factoryActual || 180000,
    design_pm: 120000,
    hardware: 140000,
    transport: 65000,
    wastage: 70000,
    site_overheads: 60000 - (billingData.salvageValue || 0), // Credit salvage against overheads
    company_overhead: 122500,
  };
  const totalCost = Object.values(currentActuals).reduce((a, b) => a + b, 0);

  // Mock reconciliation data
  const reconciliation = [
    { desc: 'Plywood 18mm', estQty: 45, actQty: 47, scrapPct: 8.2, variance: -4400 },
    { desc: 'Gypsum Board', estQty: 120, actQty: 125, scrapPct: 6.5, variance: -2250 },
    { desc: 'Premium Laminate Upgrade', estQty: 15, actQty: 15, scrapPct: 4.8, variance: 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 print:p-0 shadow-sm border border-slate-200 print:shadow-none print:border-none">
      <div className="flex justify-between items-start mb-8 border-b-2 border-slate-800 pb-6 print:border-b-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase" style={{ color: '#D4AF37' }}>STELAR INTERIORS PVT. LTD.</h1>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Executive Budget Audit Report</p>
          <p className="text-xs text-slate-400 mt-1">SOP No. SI-FIN-001</p>
        </div>
        <div className="text-right">
          <button onClick={() => window.print()} className="print:hidden bg-slate-800 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-slate-700 font-semibold mb-2 shadow">
            <Printer size={18} /> <span>Print / Export PDF</span>
          </button>
          <p className="text-sm font-semibold text-slate-700">Date: {new Date().toLocaleDateString()}</p>
          <p className="text-sm font-semibold text-slate-700">Project ID: {activeProjectId}</p>
          <p className="text-sm text-slate-600">{proj?.client}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 print:border-slate-300">
          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">Financial Baseline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Original Contract:</span><span className="font-bold">₹{proj?.baseValue.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Approved Variations:</span><span className="font-bold">₹{(projectTotal - proj?.baseValue).toLocaleString()}</span></div>
            <div className="flex justify-between text-base mt-2 pt-2 border-t border-slate-200"><span className="font-bold text-slate-800">Revised Contract Value:</span><span className="font-black text-emerald-700">₹{projectTotal.toLocaleString()}</span></div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 print:border-slate-300">
          <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">Cost & Margin Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Total Incurred Cost:</span><span className="font-bold text-red-600">₹{totalCost.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Gross Margin:</span><span className="font-bold">₹{(projectTotal - totalCost).toLocaleString()}</span></div>
            <div className="flex justify-between text-base mt-2 pt-2 border-t border-slate-200"><span className="font-bold text-slate-800">Net Margin %:</span><span className="font-black text-emerald-700">{projectTotal > 0 ? ((projectTotal - totalCost)/projectTotal * 100).toFixed(2) : 0}%</span></div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 mb-4 text-lg">SOP Head Compliance Matrix</h3>
      <table className="w-full text-left border-collapse mb-10">
        <thead>
          <tr className="bg-slate-800 text-white print:bg-slate-200 print:text-slate-800 text-xs uppercase tracking-wider">
            <th className="p-3 border border-slate-300">Cost Head</th>
            <th className="p-3 border border-slate-300 text-center">SOP Target %</th>
            <th className="p-3 border border-slate-300 text-center">Actual %</th>
            <th className="p-3 border border-slate-300 text-right">Variance (₹)</th>
            <th className="p-3 border border-slate-300 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {STANDARD_ALLOCATION.filter(a => a.id !== 'profit').map(alloc => {
            const actualVal = currentActuals[alloc.id as keyof typeof currentActuals] || 0;
            const actualPct = projectTotal > 0 ? (actualVal / projectTotal) * 100 : 0;
            const targetMidPct = (alloc.min + alloc.max) / 2;
            const targetMidVal = (projectTotal * targetMidPct) / 100;
            const variance = actualVal - targetMidVal;
            const isOver = actualPct > alloc.max;

            return (
              <tr key={alloc.id}>
                <td className="p-3 border border-slate-300 font-medium text-slate-800">
                  {alloc.name}
                  {alloc.id === 'site_overheads' && billingData.salvageValue > 0 && (
                    <span className="text-[10px] text-emerald-600 block leading-tight">(Includes Salvage Credit: -₹{billingData.salvageValue.toLocaleString()})</span>
                  )}
                </td>
                <td className="p-3 border border-slate-300 text-center text-slate-600 font-medium">{alloc.min}-{alloc.max}%</td>
                <td className={`p-3 border border-slate-300 text-center font-bold ${isOver ? 'text-red-600' : 'text-slate-800'}`}>{actualPct.toFixed(2)}%</td>
                <td className={`p-3 border border-slate-300 text-right font-bold ${variance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{variance > 0 ? '+' : ''}{variance.toFixed(0)}</td>
                <td className="p-3 border border-slate-300 text-center">
                  {isOver ? <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Overrun</span> : <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider flex justify-center items-center"><Check size={14} className="mr-1"/> Pass</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="col-span-2">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">As-Built vs. BOQ Reconciliation</h3>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest">
                <th className="p-2 border border-slate-200">Item</th>
                <th className="p-2 border border-slate-200 text-center">Est Qty</th>
                <th className="p-2 border border-slate-200 text-center">Act Qty</th>
                <th className="p-2 border border-slate-200 text-center">Scrap %</th>
                <th className="p-2 border border-slate-200 text-right">Variance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {reconciliation.map((r, i) => (
                <tr key={i}>
                  <td className="p-2 border border-slate-200 font-medium">{r.desc}</td>
                  <td className="p-2 border border-slate-200 text-center text-slate-500">{r.estQty}</td>
                  <td className="p-2 border border-slate-200 text-center font-bold text-slate-800">{r.actQty}</td>
                  <td className={`p-2 border border-slate-200 text-center font-bold ${r.scrapPct > 8 ? 'text-red-600' : 'text-emerald-600'}`}>{r.scrapPct}%</td>
                  <td className="p-2 border border-slate-200 text-right font-bold text-red-600">{r.variance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-emerald-200">
            <h4 className="font-bold text-emerald-800 text-sm flex items-center mb-2"><RotateCcw size={14} className="mr-1"/> Salvage & Scrap Recovery</h4>
            <p className="text-[10px] text-slate-500 mb-2 leading-tight">Enter value of offcuts/scrap resold to offset project overheads.</p>
            <div className="flex items-center">
              <IndianRupee size={16} className="text-slate-400 absolute ml-2" />
              <input 
                type="number" 
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded font-bold text-slate-800 focus:ring-emerald-500 print:hidden"
                value={billingData.salvageValue || 0}
                onChange={e => updateSalvageValue(activeProjectId, Number(e.target.value))}
              />
              <span className="hidden print:inline font-bold text-emerald-700 pl-8">₹{(billingData.salvageValue || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">DLP & Retention</h4>
            <div className="text-xs space-y-2 font-medium">
              <div className="flex justify-between"><span className="text-slate-500">Amount Retained:</span><span className="text-slate-800 font-bold">₹{billingData.retention?.amount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Release Date:</span><span className="text-slate-800 font-bold">{billingData.retention?.releaseDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="text-amber-600 font-bold uppercase">{billingData.retention?.status}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-3 gap-8 text-center print:break-inside-avoid">
        <div>
          <div className="border-t border-slate-400 pt-2 font-bold text-slate-800 text-sm">Site In-Charge / PM</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Date: ___________</div>
        </div>
        <div>
          <div className="border-t border-slate-400 pt-2 font-bold text-slate-800 text-sm">Head of Estimation</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">Date: ___________</div>
        </div>
        <div>
          <div className="border-t border-slate-800 pt-2 font-black text-slate-900 text-sm" style={{ color: '#D4AF37' }}>Managing Director</div>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Final Financial Sign-Off</div>
        </div>
      </div>
    </div>
  );
}
