import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileSpreadsheet, HardHat, ShoppingCart, Users, Layers, FileText, DatabaseBackup, Download, Upload, IndianRupee } from 'lucide-react';
import { AppProvider, useAppStore } from './store/AppProvider';

import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import BoqBuilder from './pages/BoqBuilder';
import Procurement from './pages/Procurement';
import LabourLedger from './pages/LabourLedger';
import VariationRegistry from './pages/VariationRegistry';
import AuditReport from './pages/AuditReport';
import Billing from './pages/Billing';

function Sidebar() {
  const location = useLocation();
  const { resetData, exportData, importData } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/projects', name: 'Projects', icon: <HardHat size={20} /> },
    { path: '/boq', name: 'BOQ Builder', icon: <FileSpreadsheet size={20} /> },
    { path: '/variations', name: 'Variation Orders', icon: <Layers size={20} /> },
    { path: '/procurement', name: 'Procurement', icon: <ShoppingCart size={20} /> },
    { path: '/labour', name: 'Labour Ledger', icon: <Users size={20} /> },
    { path: '/billing', name: 'Billing & Invoicing', icon: <IndianRupee size={20} /> },
    { path: '/audit', name: 'Audit Report', icon: <FileText size={20} /> },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) importData(evt.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full print:hidden shadow-xl z-20">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#D4AF37' }}>STELAR ERP</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Cost Control System</p>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className="flex space-x-2">
          <button onClick={exportData} className="flex-1 flex items-center justify-center space-x-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-md transition-colors" title="Export Backup JSON">
            <Download size={14} /> <span>Backup</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center space-x-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-md transition-colors" title="Import Backup JSON">
            <Upload size={14} /> <span>Restore</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" className="hidden" />
        </div>
        <button onClick={resetData} className="w-full flex items-center justify-center space-x-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-md transition-colors">
          <DatabaseBackup size={14} />
          <span>Reset Demo Data</span>
        </button>
        <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest pt-2">SOP SI-FIN-001 v1.0</p>
      </div>
    </aside>
  );
}

function MainLayout() {
  const { data, activeProjectId, setActiveProjectId } = useAppStore();
  const [showSopHelp, setShowSopHelp] = React.useState(false);
  
  // Calculate Cash flow gap
  const billingData = data.billing[activeProjectId] || { milestones: [] };
  const milestones = billingData.milestones || [];
  const totalCollected = milestones.reduce((sum: number, m: any) => sum + (m.received || 0), 0);
  
  const currentActuals = {
    materials: 1100000,
    site_labour: data.labour[activeProjectId]?.siteActual || 320000,
    factory_labour: data.labour[activeProjectId]?.factoryActual || 180000,
    transport: 65000,
    site_overheads: 60000,
  };
  const totalPayouts = activeProjectId === 'SI-2026-004' ? 0 : Object.values(currentActuals).reduce((a, b) => a + b, 0);
  const cashFlowGap = totalPayouts - totalCollected;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="print:hidden bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-slate-800">Project Budget & Cost Control</h2>
            {cashFlowGap > 0 && (
              <span className="bg-amber-100 border border-amber-300 text-amber-800 text-xs px-3 py-1 rounded-full font-bold shadow-sm animate-pulse">
                Negative Project Cash Gap: ₹{cashFlowGap.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowSopHelp(true)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold border border-slate-200 shadow-sm" title="SOP Cheatsheet">
              ?
            </button>
            <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-md font-semibold border border-slate-200 shadow-sm flex items-center">
              <span className="mr-2">Active Project:</span>
              <select 
                value={activeProjectId} 
                onChange={e => setActiveProjectId(e.target.value)}
                className="bg-transparent text-emerald-700 font-bold text-base focus:outline-none cursor-pointer"
              >
                {data.projects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.id} - {p.client}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {showSopHelp && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border-t-4" style={{ borderColor: '#D4AF37' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">SOP SI-FIN-001 Reference</h3>
                  <p className="text-sm font-semibold text-slate-500">Stelar Interiors Pvt. Ltd.</p>
                </div>
                <button onClick={() => setShowSopHelp(false)} className="text-slate-400 hover:text-slate-800">✖</button>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-2">Target Budget Allocation %</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>Materials: 45–50%</li>
                    <li>Site Labour: 12–15%</li>
                    <li>Factory Labour: 5–8%</li>
                    <li>Design & PM: 4–6%</li>
                    <li>Hardware: 5–7%</li>
                    <li>Profit Margin: 10–15%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-2">Material Wastage Ceilings %</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>Plywood, MDF, WPC: Max 8%</li>
                    <li>Gypsum Board, Tiles: Max 10%</li>
                    <li>Edge Band, Glass, Paint: Max 5%</li>
                    <li>Hardware, Electrical: Max 5%</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-amber-700 font-bold bg-amber-50 p-3 mt-6 rounded border border-amber-200">
                Warning: Any deviations from the above bounds (Variation POs, excess wastage, over-limit POs) require documented MD override & sign-off.
              </p>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/boq" element={<BoqBuilder />} />
            <Route path="/variations" element={<VariationRegistry />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/labour" element={<LabourLedger />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/audit" element={<AuditReport />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
