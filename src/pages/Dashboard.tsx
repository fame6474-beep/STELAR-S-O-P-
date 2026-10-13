import React from 'react';
import { DollarSign, PieChart, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, FileDown } from 'lucide-react';
import { STANDARD_ALLOCATION } from '../data/constants';
import { useAppStore } from '../store/AppProvider';

export default function Dashboard() {
  const { data, activeProjectId, getProjectTotal } = useAppStore();
  
  const projectTotal = getProjectTotal(activeProjectId);
  const baseProj = data.projects.find((p:any) => p.id === activeProjectId);
  
  // Use mock actuals or calculate from store if fully implemented
  const currentActuals = {
    materials: 1100000,
    site_labour: data.labour[activeProjectId]?.siteActual || 320000,
    factory_labour: data.labour[activeProjectId]?.factoryActual || 180000,
    design_pm: 120000,
    hardware: 140000,
    transport: 65000,
    wastage: 70000,
    site_overheads: 60000,
    company_overhead: 122500,
  };

  const totalCost = Object.values(currentActuals).reduce((a, b) => a + b, 0);
  const currentMargin = projectTotal - totalCost;
  const marginPercent = projectTotal > 0 ? (currentMargin / projectTotal) * 100 : 0;
  
  const variationTotal = projectTotal - (baseProj?.baseValue || 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg"><DollarSign size={24} /></div>
              <h3 className="text-slate-500 font-medium text-sm">Revised Contract Value</h3>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">₹{projectTotal.toLocaleString()}</p>
          {variationTotal > 0 && (
            <p className="text-xs text-emerald-600 font-semibold mt-2">+ ₹{variationTotal.toLocaleString()} in Approved Variations</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg"><TrendingDown size={24} /></div>
            <h3 className="text-slate-500 font-medium text-sm">Total Costs Incurred</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">₹{totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={24} /></div>
            <h3 className="text-slate-500 font-medium text-sm">Current Margin</h3>
          </div>
          <p className="text-3xl font-bold text-slate-800">₹{currentMargin.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg"><PieChart size={24} /></div>
            <h3 className="text-slate-500 font-medium text-sm">Margin %</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${marginPercent >= 10 ? 'text-emerald-600' : 'text-red-600'}`}>
              {marginPercent.toFixed(1)}%
            </p>
            <span className="text-sm text-slate-500">(Target: 10-15%)</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <PieChart className="mr-2" style={{ color: '#D4AF37' }} size={20} />
          Budget Allocation Compliance (Recalibrated to Revised Baseline)
        </h3>
        
        <div className="space-y-5">
          {STANDARD_ALLOCATION.filter(a => a.id !== 'profit').map((alloc) => {
            const actualVal = currentActuals[alloc.id as keyof typeof currentActuals] || 0;
            const actualPct = projectTotal > 0 ? (actualVal / projectTotal) * 100 : 0;
            const isOver = actualPct > alloc.max;
            const isUnder = actualPct < alloc.min;
            const isWarning = actualPct > alloc.max - 1; 
            
            let barColor = 'bg-emerald-500';
            if (isOver) barColor = 'bg-red-500';
            else if (isWarning) barColor = 'bg-yellow-400';

            return (
              <div key={alloc.id} className="group">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center">
                    {alloc.name}
                    {isOver && <AlertTriangle size={14} className="ml-2 text-red-500" />}
                    {!isOver && !isUnder && <CheckCircle2 size={14} className="ml-2 text-emerald-500" />}
                  </span>
                  <div className="text-right">
                    <span className={`font-bold ${isOver ? 'text-red-600' : 'text-slate-700'}`}>
                      {actualPct.toFixed(1)}%
                    </span>
                    <span className="text-slate-400 ml-2">
                      (Target: {alloc.min}-{alloc.max}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                  <div className={`${barColor} h-2.5 transition-all duration-500`} style={{ width: `${Math.min(actualPct, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
