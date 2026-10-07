import React from 'react';
import { Lock, Download, FileSignature, RefreshCw, ShieldCheck, AlertCircle, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore } from '../store/AppProvider';

export default function Dashboard() {
  const { data, activeProjectId, getProjectTotal } = useAppStore();
  
  const projectTotal = getProjectTotal(activeProjectId);
  const baseProj = data.projects.find((p:any) => p.id === activeProjectId);
  
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
  const variance = projectTotal - totalCost;
  
  const mockChartData = [
    { name: 'JAN', civil: 12000, mep: 5000, finishes: 0 },
    { name: 'FEB', civil: 15000, mep: 6000, finishes: 0 },
    { name: 'MAR', civil: 18000, mep: 8000, finishes: 2000 },
    { name: 'APR (Q2)', civil: 14000, mep: 12000, finishes: 5000 },
    { name: 'MAY (E)', civil: 10000, mep: 15000, finishes: 8000 },
    { name: 'JUN (E)', civil: 5000, mep: 10000, finishes: 15000 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[10px] bg-[#1a1d24] text-emerald-500 px-2 py-1 rounded border border-emerald-900/50 uppercase tracking-widest font-bold">
              Tier 1 Asset Active
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">
              Audit Ref: VAC-2026-99A
            </span>
          </div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
            {baseProj?.client || 'Project Dashboard'} <span className="text-slate-500">— Capital Governance</span>
          </h1>
          <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
            <span>Master Cost Code: <strong className="text-slate-200">{activeProjectId}</strong></span>
            <span>•</span>
            <span>Baseline Lock: <strong className="text-slate-200">Oct 1, 2026</strong></span>
            <span>•</span>
            <span>Currency: <strong className="text-slate-200">INR (₹)</strong></span>
            <span>•</span>
            <span className="flex items-center text-emerald-500"><ShieldCheck size={12} className="mr-1" /> Immutability Verified</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button className="flex items-center space-x-2 bg-[#1a1d24] hover:bg-[#222630] border border-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-semibold transition-colors w-64 justify-center">
            <Download size={14} /> <span>Export Report (PDF/XLS)</span>
          </button>
          <button className="flex items-center space-x-2 bg-[#1a1d24] hover:bg-[#222630] border border-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-semibold transition-colors w-64 justify-center">
            <FileSignature size={14} /> <span>Request Variance Approval</span>
          </button>
          <button className="flex items-center space-x-2 bg-[#D4AF37] hover:bg-[#c29e2f] text-black px-4 py-2 rounded text-xs font-bold transition-colors w-64 justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <RefreshCw size={14} /> <span>Reallocate Contingency</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#13161c] border border-slate-800/80 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold w-1/2 leading-tight">Total Approved Budget</h3>
              <span className="flex items-center text-amber-500 text-[10px] font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Lock size={10} className="mr-1" /> Locked
              </span>
            </div>
            <p className="text-3xl font-light text-white font-mono tracking-tight mt-3">₹{(projectTotal/100).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-2">Baseline revision v3.2 • Board Ratified</p>
          </div>
          <div className="mt-6 flex justify-between items-end border-t border-slate-800/50 pt-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Ledger Allocation</p>
              <p className="text-white font-bold text-sm">100.0% Assigned</p>
            </div>
          </div>
        </div>

        <div className="bg-[#13161c] border border-slate-800/80 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold w-1/2 leading-tight">Actual Committed Spend</h3>
              <span className="flex items-center text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <ArrowDownRight size={10} className="mr-1" /> 4.8% Under Forecast
              </span>
            </div>
            <p className="text-3xl font-light text-white font-mono tracking-tight mt-3">₹{(totalCost/100).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-2">42.7% consumed of total envelope</p>
          </div>
          <div className="mt-6 flex items-center space-x-2 border-t border-slate-800/50 pt-4 text-emerald-500 text-xs font-medium">
            <CheckCircle2 size={14} /> <span>On Target - 14 days to next milestone</span>
          </div>
        </div>

        <div className="bg-[#13161c] border border-slate-800/80 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold w-1/2 leading-tight">Variance at Completion (VAC)</h3>
              <span className="flex items-center text-emerald-500 text-[10px] font-bold">
                +12.4% vs Baseline
              </span>
            </div>
            <p className="text-3xl font-light text-emerald-400 font-mono tracking-tight mt-3">+₹{(variance/100).toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 mt-2">Projected surplus at final commissioning</p>
          </div>
          <div className="mt-6 flex justify-between items-end border-t border-slate-800/50 pt-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Confidence Index</p>
              <p className="text-white font-bold text-sm">98.4% (Monte Carlo P80)</p>
            </div>
          </div>
        </div>

        <div className="bg-[#13161c] border border-slate-800/80 p-5 rounded-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold w-1/2 leading-tight">Unallocated Contingency</h3>
              <span className="flex items-center text-amber-500 text-[10px] font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <AlertCircle size={10} className="mr-1" /> High Buffer
              </span>
            </div>
            <p className="text-3xl font-light text-[#D4AF37] font-mono tracking-tight mt-3">₹112,500</p>
            <p className="text-[10px] text-slate-500 mt-2">7.55% buffer preserved • 0 high-risk overrun flags</p>
          </div>
          <div className="mt-6 flex justify-between items-end border-t border-slate-800/50 pt-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Escrow Mode</p>
              <p className="text-white font-bold text-sm font-mono tracking-widest">VAULT-AC-09 // STABLE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#13161c] border border-slate-800/80 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Budget vs. Actual Spending Trajectory</h3>
              <p className="text-xs text-slate-400 mt-1">Monthly CapEx burn rate segmented by major architectural divisions (₹ thousands)</p>
            </div>
            <div className="flex space-x-2 text-xs font-bold">
              <span className="px-3 py-1 bg-[#1a1d24] text-slate-400 rounded">Q1</span>
              <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded">Q2 Active</span>
              <span className="px-3 py-1 bg-[#1a1d24] text-slate-400 rounded">Q3 Forecast</span>
              <span className="px-3 py-1 bg-[#1a1d24] text-slate-400 rounded">Full Year</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#e2e8f0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Bar dataKey="civil" name="CIVIL & SUPERSTRUCTURE" stackId="a" fill="#10b981" />
                <Bar dataKey="mep" name="MECHANICAL & MEP" stackId="a" fill="#0f766e" />
                <Bar dataKey="finishes" name="LUXURY FINISHES & STONE" stackId="a" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center text-xs">
            <div className="flex items-center text-emerald-500 font-medium">
              <ShieldCheck size={14} className="mr-2" /> Audited against FIDIC Red Book contracts at bill milestones.
            </div>
            <div className="text-white font-bold">
              Target ceiling: ₹18.4M/mo
            </div>
          </div>
        </div>

        {/* Risk & Pipeline */}
        <div className="bg-[#13161c] border border-slate-800/80 rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Governance Health</h3>
            <span className="text-[10px] text-emerald-500 font-bold tracking-widest">ISO 55000</span>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Risk & Approval Velocity</h2>
          <p className="text-xs text-slate-400 mb-6">Real-time contingency drawdown security index</p>
          
          <div className="flex items-center justify-center mb-8 mt-2">
            <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="44" cy="44" r="44" stroke="#10b981" strokeWidth="8" fill="none" strokeDasharray="276" strokeDashoffset="40" className="translate-x-1 translate-y-1" />
              </svg>
              <span className="text-2xl font-bold text-white">94</span>
            </div>
            <div className="ml-6 flex-1">
              <h4 className="text-sm font-bold text-white mb-1">Contingency Health: Optimal</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">Current burn velocity will retain ₹8.4M+ reserve upon structural handover.</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3 border-t border-slate-800/50 pt-6">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Executive Pipeline</h3>
            <span className="text-[10px] text-amber-500 font-bold">2 Actions Required</span>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="bg-[#1a1d24] border border-slate-700/50 p-3 rounded-md flex justify-between items-start">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-white">CO #041: Acoustic Upgrade</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">₹280,000 • Permasteelisa</p>
                </div>
              </div>
              <span className="text-[9px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Pre-Approved</span>
            </div>
            <div className="bg-[#1a1d24] border border-slate-700/50 p-3 rounded-md flex justify-between items-start">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-bold text-white">CO #042: MEP Pump Duplication</p>
                  <p className="text-[10px] text-amber-400 font-mono mt-0.5">₹132,000 • Daikin Global</p>
                </div>
              </div>
              <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Pending CFO</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex space-x-3">
            <button className="flex-1 bg-[#1a1d24] hover:bg-[#222630] border border-slate-700 text-slate-300 py-2 rounded text-xs font-semibold transition-colors">Batch Sign-Off</button>
            <button className="flex-1 bg-[#D4AF37] hover:bg-[#c29e2f] text-black py-2 rounded text-xs font-bold transition-colors">Review Dossier</button>
          </div>
        </div>
      </div>

      {/* Bottom Section: BOQ Ledger Table */}
      <div className="mt-6 bg-[#13161c] border border-slate-800/80 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-[#16191f]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              Bill of Quantities (BOQ) & Cost Code Ledger
              <span className="ml-3 text-[10px] bg-[#1a1d24] text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">Master RES 1.0</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Audited cost center breakdown, vendor commitment balances, and real-time variances</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Committed Spend</p>
            <p className="text-sm font-bold text-white">₹{(totalCost/100).toLocaleString()}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0f1115] text-slate-500 uppercase tracking-widest font-bold border-b border-slate-800/80">
                <th className="px-6 py-4">Cost Code</th>
                <th className="px-6 py-4">Description / Package</th>
                <th className="px-6 py-4">Contractor</th>
                <th className="px-6 py-4 text-center">Unit</th>
                <th className="px-6 py-4 text-right">Quantity</th>
                <th className="px-6 py-4 text-right">Unit Rate</th>
                <th className="px-6 py-4 text-right">Total Budget</th>
                <th className="px-6 py-4 text-right">Actual Committed</th>
                <th className="px-6 py-4 text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr className="hover:bg-[#1a1d24]/50 transition-colors">
                <td className="px-6 py-4 font-mono text-[#D4AF37] font-bold">03-3100</td>
                <td className="px-6 py-4 text-slate-300 font-medium">Post-Tensioned Concrete</td>
                <td className="px-6 py-4 text-slate-400">Apex Structural</td>
                <td className="px-6 py-4 text-slate-500 text-center">m²</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">18,400</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹1,250</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹23,000,000</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹21,850,000</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-emerald-500 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">+₹1,150,000</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a1d24]/50 transition-colors">
                <td className="px-6 py-4 font-mono text-[#D4AF37] font-bold">08-4400</td>
                <td className="px-6 py-4 text-slate-300 font-medium">Curtain Wall Facade</td>
                <td className="px-6 py-4 text-slate-400">Permasteelisa Group</td>
                <td className="px-6 py-4 text-slate-500 text-center">m²</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">12,850</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹1,820</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹23,387,000</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹22,910,000</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-emerald-500 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">+₹477,000</span>
                </td>
              </tr>
              <tr className="hover:bg-[#1a1d24]/50 transition-colors">
                <td className="px-6 py-4 font-mono text-[#D4AF37] font-bold">09-6000</td>
                <td className="px-6 py-4 text-slate-300 font-medium">Imported Hardwood Flooring</td>
                <td className="px-6 py-4 text-slate-400">Manni Crotici SpA</td>
                <td className="px-6 py-4 text-slate-500 text-center">m²</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">9,200</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹950</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹8,618,000</td>
                <td className="px-6 py-4 text-slate-300 text-right font-mono">₹8,820,000</td>
                <td className="px-6 py-4 text-right">
                  <span className="text-amber-500 font-mono font-bold bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">-₹202,000</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
