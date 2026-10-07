import React from 'react';
import { IndianRupee, TrendingUp, TrendingDown, CheckCircle, Clock } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export default function Billing() {
  const { data, activeProjectId, getProjectTotal } = useAppStore();
  
  const projectTotal = getProjectTotal(activeProjectId);
  const billingData = data.billing[activeProjectId] || { milestones: [] };
  const milestones = billingData.milestones || [];

  const totalCollected = milestones.reduce((sum: number, m: any) => sum + (m.received || 0), 0);
  const totalBilled = milestones.filter((m: any) => m.billed).reduce((sum: number, m: any) => sum + m.amount, 0);
  const outstanding = totalBilled - totalCollected;

  // Calculate actual project cost for cash flow gaps
  const currentActuals = {
    materials: 1100000,
    site_labour: data.labour[activeProjectId]?.siteActual || 320000,
    factory_labour: data.labour[activeProjectId]?.factoryActual || 180000,
    transport: 65000,
    site_overheads: 60000,
  };
  const totalPayouts = Object.values(currentActuals).reduce((a, b) => a + b, 0);
  const cashFlowHealth = totalCollected - totalPayouts;
  const isHealthy = cashFlowHealth >= 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Billing & Invoicing</h2>
          <p className="text-sm text-slate-500 mt-1">Client Milestones & Cash Flow Tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 font-semibold text-sm mb-2 uppercase tracking-wider">Total Collected</p>
          <div className="flex items-center text-emerald-600 font-black text-3xl">
            <IndianRupee size={28} className="mr-1" />
            {totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-2">Billed: ₹{totalBilled.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 font-semibold text-sm mb-2 uppercase tracking-wider">Outstanding (Billed)</p>
          <div className="flex items-center text-amber-600 font-black text-3xl">
            <IndianRupee size={28} className="mr-1" />
            {outstanding.toLocaleString()}
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border border-slate-200 ${isHealthy ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className={`font-semibold text-sm mb-2 uppercase tracking-wider ${isHealthy ? 'text-emerald-700' : 'text-red-700'}`}>Project Cash Flow Health</p>
          <div className={`flex items-center font-black text-3xl ${isHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
            {isHealthy ? <TrendingUp size={28} className="mr-2" /> : <TrendingDown size={28} className="mr-2" />}
            ₹{Math.abs(cashFlowHealth).toLocaleString()}
          </div>
          <p className={`text-xs mt-2 font-medium ${isHealthy ? 'text-emerald-600' : 'text-red-600'}`}>
            {isHealthy ? 'Collections exceed payouts (Healthy)' : 'Negative Cash Flow Gap (Urgent)'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Milestone Schedule</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider bg-slate-100">
              <th className="p-4 font-semibold border-b border-slate-200">Tranche</th>
              <th className="p-4 font-semibold border-b border-slate-200 text-center">%</th>
              <th className="p-4 font-semibold border-b border-slate-200 text-right">Amount (₹)</th>
              <th className="p-4 font-semibold border-b border-slate-200 text-center">Status</th>
              <th className="p-4 font-semibold border-b border-slate-200 text-right">Received (₹)</th>
              <th className="p-4 font-semibold border-b border-slate-200 text-right">TDS (₹)</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {milestones.map((m: any) => (
              <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{m.name}</td>
                <td className="p-4 text-center font-bold text-slate-600">{m.percent}%</td>
                <td className="p-4 text-right font-bold text-slate-800">{m.amount.toLocaleString()}</td>
                <td className="p-4 text-center">
                  {m.received >= m.amount ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex justify-center items-center">
                      <CheckCircle size={14} className="mr-1" /> Paid
                    </span>
                  ) : m.billed ? (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex justify-center items-center">
                      <Clock size={14} className="mr-1" /> Pending
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Unbilled</span>
                  )}
                </td>
                <td className={`p-4 text-right font-bold ${m.received > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {m.received > 0 ? m.received.toLocaleString() : '-'}
                </td>
                <td className="p-4 text-right text-slate-500">
                  {m.tds > 0 ? m.tds.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
