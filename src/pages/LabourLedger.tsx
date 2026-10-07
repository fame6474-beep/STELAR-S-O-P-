import React from 'react';
import { Factory, Wrench } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export default function LabourLedger() {
  const { data, activeProjectId, getProjectTotal } = useAppStore();
  const contractValue = getProjectTotal(activeProjectId);
  
  // SOP Targets (Combined 17-23%)
  const targets = {
    factory: { min: 5, max: 8 },
    site: { min: 12, max: 15 }
  };

  const currentLedger = {
    factoryActual: data.labour[activeProjectId]?.factoryActual || 0,
    siteActual: data.labour[activeProjectId]?.siteActual || 0
  };

  const factoryPct = contractValue > 0 ? (currentLedger.factoryActual / contractValue) * 100 : 0;
  const sitePct = contractValue > 0 ? (currentLedger.siteActual / contractValue) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Labour Ledger</h2>
        <p className="text-sm text-slate-500 mt-1">Factory & Site Labour Segregation (SOP Section 9)</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Factory Labour */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Factory size={20} /></div>
            <h3 className="font-bold text-slate-800">Factory Labour</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-slate-500">Current Spend</span>
              <span className="text-3xl font-bold text-slate-800">₹{currentLedger.factoryActual.toLocaleString()}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Budget Consumed</span>
                <span className={`font-bold \${factoryPct > targets.factory.max ? 'text-red-600' : 'text-green-600'}`}>
                  {factoryPct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`\${factoryPct > targets.factory.max ? 'bg-red-500' : 'bg-green-500'} h-2 rounded-full`} style={{ width: `\${Math.min(factoryPct, 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 text-right">Target Range: {targets.factory.min}% - {targets.factory.max}%</p>
            </div>

            <ul className="text-sm space-y-2 mt-4 border-t border-slate-100 pt-4">
              <li className="flex justify-between"><span className="text-slate-600">Cutting & Edge Banding</span><span className="font-medium">₹65,000</span></li>
              <li className="flex justify-between"><span className="text-slate-600">CNC Routing</span><span className="font-medium">₹45,000</span></li>
              <li className="flex justify-between"><span className="text-slate-600">Assembly & Packing</span><span className="font-medium">₹70,000</span></li>
            </ul>
          </div>
        </div>

        {/* Site Labour */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><Wrench size={20} /></div>
            <h3 className="font-bold text-slate-800">Site Labour / Installation</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-slate-500">Current Spend</span>
              <span className="text-3xl font-bold text-slate-800">₹{currentLedger.siteActual.toLocaleString()}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">Budget Consumed</span>
                <span className={`font-bold \${sitePct > targets.site.max ? 'text-red-600' : 'text-green-600'}`}>
                  {sitePct.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`\${sitePct > targets.site.max ? 'bg-red-500' : 'bg-green-500'} h-2 rounded-full`} style={{ width: `\${Math.min(sitePct, 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-400 text-right">Target Range: {targets.site.min}% - {targets.site.max}%</p>
            </div>

            <ul className="text-sm space-y-2 mt-4 border-t border-slate-100 pt-4">
              <li className="flex justify-between"><span className="text-slate-600">Carpentry Install</span><span className="font-medium">₹180,000</span></li>
              <li className="flex justify-between"><span className="text-slate-600">Gypsum & False Ceiling</span><span className="font-medium">₹85,000</span></li>
              <li className="flex justify-between"><span className="text-slate-600">Electrical & MEP</span><span className="font-medium">₹55,000</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
