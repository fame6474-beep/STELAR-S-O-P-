import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileSpreadsheet, HardHat, ShoppingCart, 
  Users, Layers, FileText, IndianRupee, Settings, 
  Bell, History, Search, Download, ShieldCheck 
} from 'lucide-react';
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
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/projects', name: 'Projects & Portfolios', icon: <HardHat size={18} /> },
    { path: '/boq', name: 'Bill of Quantities (BOQ)', icon: <FileSpreadsheet size={18} /> },
    { path: '/variations', name: 'Variation Orders', icon: <Layers size={18} /> },
    { path: '/procurement', name: 'Procurement & Contracts', icon: <ShoppingCart size={18} /> },
    { path: '/labour', name: 'Labour Ledger', icon: <Users size={18} /> },
    { path: '/billing', name: 'Invoices & Cashflow', icon: <IndianRupee size={18} /> },
    { path: '/audit', name: 'Audits & Compliance', icon: <FileText size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#090b0f] text-slate-300 flex flex-col h-full border-r border-slate-800/50 print:hidden z-20">
      <div className="p-6 border-b border-slate-800/50 flex items-center space-x-3">
        <div className="w-8 h-8 bg-emerald-900/40 rounded flex items-center justify-center border border-emerald-500/30">
          <ShieldCheck className="text-emerald-500" size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">STELAR ERP</h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Governance Matrix</p>
        </div>
      </div>
      <div className="px-6 py-4">
        <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-3">Core Modules</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all text-sm ${
                  isActive 
                    ? 'bg-[#1a1d24] text-white font-medium border border-slate-700/50' 
                    : 'text-slate-400 hover:bg-[#1a1d24]/50 hover:text-slate-200'
                }`}
              >
                <span className={`${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-800/50">
        <button className="flex items-center space-x-3 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <div className="bg-[#13161c] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Treasury Ledger</p>
            <p className="text-xs text-emerald-500 font-mono mt-0.5">NODE 04 • ENCRYPTED</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
        </div>
      </div>
    </aside>
  );
}

function MainLayout() {
  const { data, activeProjectId, setActiveProjectId } = useAppStore();
  
  return (
    <div className="flex h-screen bg-[#0f1115] font-sans text-slate-200 selection:bg-emerald-500/30">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="print:hidden bg-[#0f1115] px-8 py-4 border-b border-slate-800/50 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center w-1/3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search projects, cost codes, contracts..." 
                className="w-full bg-[#16191f] border border-slate-800 rounded-md pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-all placeholder-slate-600"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-[#16191f] border border-slate-800 rounded-md px-3 py-1.5 cursor-pointer hover:bg-[#1a1d24]">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Quarter</span>
                <span className="text-sm font-medium text-slate-300">FY2026 - Q3</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-slate-400">
              <button className="hover:text-white transition-colors relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
              <button className="hover:text-white transition-colors"><History size={18} /></button>
            </div>

            <div className="flex items-center space-x-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">Julian Vance</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Chief Financial Officer</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Julian+Vance&background=10b981&color=fff" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

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
