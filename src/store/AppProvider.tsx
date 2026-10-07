import React, { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_DATA = {
  projects: [
    { id: 'SI-2026-001', client: 'Skyline Penthouse', status: 'Active', baseValue: 2450000 },
    { id: 'SI-2026-002', client: 'Nova FinTech Headquarters', status: 'Active', baseValue: 6500000 },
    { id: 'SI-2026-003', client: 'Villa Serene Kitchens', status: 'Closeout', baseValue: 1850000 },
    { id: 'SI-2026-004', client: 'Empty Shell Test', status: 'Planning', baseValue: 0 } // For Zero-Division Test
  ],
  boqs: [
    { id: 1, projectId: 'SI-2026-001', desc: 'Master Bedroom Wardrobe', material: 'Plywood', qty: 45, rate: 2200, wastage: 6 },
    { id: 2, projectId: 'SI-2026-001', desc: 'Living Room Ceiling', material: 'Gypsum Board', qty: 120, rate: 450, wastage: 12, flagMdApproval: true, mdJustification: 'Complex ceiling design' },
    { id: 3, projectId: 'SI-2026-002', desc: 'Boardroom Partitions', material: 'Gypsum Board', qty: 450, rate: 450, wastage: 8 },
    { id: 4, projectId: 'SI-2026-003', desc: 'Modular Kitchen Carcass', material: 'Plywood', qty: 65, rate: 2100, wastage: 5 },
  ],
  pos: [
    { id: 'PO-2026-001', projectId: 'SI-2026-001', item: 'Plywood 18mm', boqId: 1, requestedQty: 47, vendor: 'Century Ply Depot', status: 'Approved' },
    { id: 'PO-2026-002', projectId: 'SI-2026-001', item: 'Premium Laminate', isVariation: true, variationId: 'VO-2026-002', requestedQty: 15, vendor: 'Greenlam Dists', status: 'Pending' },
    // Test Case: Unapproved Variation PO for SI-2026-002
    { id: 'PO-2026-003', projectId: 'SI-2026-002', item: 'Acoustic Panels', isVariation: true, variationId: 'VO-2026-003', requestedQty: 120, vendor: 'SoundPro India', status: 'Pending' }
  ],
  variations: [
    { id: 'VO-2026-001', projectId: 'SI-2026-001', desc: 'Add False Ceiling in Kitchen', category: 'Gypsum Works', material: 'Gypsum Board', qty: 25, rate: 450, wastage: 8, status: 'Client Approved', additionalValue: 15000 },
    { id: 'VO-2026-002', projectId: 'SI-2026-001', desc: 'Premium Laminate Upgrade', category: 'Finishes', material: 'Laminate', qty: 15, rate: 1200, wastage: 5, status: 'Submitted', additionalValue: 18000 },
    // Unapproved variation for SI-2026-002
    { id: 'VO-2026-003', projectId: 'SI-2026-002', desc: 'Extra Boardroom Acoustic Panels', category: 'Finishes', material: 'MDF', qty: 120, rate: 850, wastage: 5, status: 'Draft', additionalValue: 107100 }
  ],
  labour: {
    'SI-2026-001': { factoryActual: 180000, siteActual: 320000 },
    'SI-2026-002': { factoryActual: 150000, siteActual: 850000 }, // High site labour
    'SI-2026-003': { factoryActual: 145000, siteActual: 45000 }   // Heavy factory labour
  },
  billing: {
    'SI-2026-001': {
      milestones: [
        { id: 1, name: 'Advance', percent: 10, amount: 245000, billed: true, received: 245000, tds: 0 },
        { id: 2, name: 'Civil/Carpentry', percent: 40, amount: 980000, billed: true, received: 900000, tds: 80000 },
        { id: 3, name: 'Finishing', percent: 40, amount: 980000, billed: false, received: 0, tds: 0 },
        { id: 4, name: 'Handover/Retention', percent: 10, amount: 245000, billed: false, received: 0, tds: 0 },
      ],
      salvageValue: 15000,
      retention: { amount: 122500, releaseDate: '2027-10-01', status: 'Pending' }
    },
    'SI-2026-002': {
      milestones: [
        { id: 5, name: 'Advance 15%', percent: 15, amount: 975000, billed: true, received: 955500, tds: 19500 }, // 2% TDS math
        { id: 6, name: 'First Fix 35%', percent: 35, amount: 2275000, billed: true, received: 0, tds: 0 },
        { id: 7, name: 'Finishing 35%', percent: 35, amount: 2275000, billed: false, received: 0, tds: 0 },
        { id: 8, name: 'Handover 15%', percent: 15, amount: 975000, billed: false, received: 0, tds: 0 },
      ],
      salvageValue: 0,
      retention: { amount: 325000, releaseDate: '2027-12-01', status: 'Pending' }
    },
    'SI-2026-003': {
      milestones: [
        { id: 9, name: 'Advance 50%', percent: 50, amount: 925000, billed: true, received: 925000, tds: 0 },
        { id: 10, name: 'Dispatch 45%', percent: 45, amount: 832500, billed: true, received: 832500, tds: 0 },
        { id: 11, name: 'Retention 5%', percent: 5, amount: 92500, billed: true, received: 0, tds: 0 },
      ],
      salvageValue: 18500, // Recovered scrap
      retention: { amount: 92500, releaseDate: '2027-05-15', status: 'Pending' }
    }
  }
};

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('stelar-erp-data-v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure new schema fields exist
        if (!parsed.labour) parsed.labour = INITIAL_DATA.labour;
        if (!parsed.billing) parsed.billing = INITIAL_DATA.billing;
        return parsed;
      } catch(e) {}
    }
    return INITIAL_DATA;
  });

  const [activeProjectId, setActiveProjectId] = useState('SI-2026-001');

  useEffect(() => {
    localStorage.setItem('stelar-erp-data-v2', JSON.stringify(data));
  }, [data]);

  const resetData = () => {
    setData(INITIAL_DATA);
    setActiveProjectId('SI-2026-001');
  };

  const getProjectTotal = (projectId: string) => {
    const proj = data.projects.find((p: any) => p.id === projectId);
    if (!proj) return 0;
    const approvedVariations = data.variations
      .filter((v: any) => v.projectId === projectId && v.status === 'Client Approved')
      .reduce((sum: number, v: any) => sum + (v.additionalValue || (v.qty * v.rate * (1 + v.wastage/100))), 0);
    return proj.baseValue + approvedVariations;
  };

  const updateVariationStatus = (id: string, status: string) => {
    setData((prev: any) => ({
      ...prev,
      variations: prev.variations.map((v: any) => v.id === id ? { ...v, status } : v)
    }));
  };

  const addVariation = (variation: any) => {
    setData((prev: any) => ({
      ...prev,
      variations: [...prev.variations, variation]
    }));
  };

  const addBoqItem = (item: any) => {
    setData((prev: any) => ({
      ...prev,
      boqs: [...prev.boqs, item]
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stelar_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.projects) {
        setData(parsed);
      } else {
        alert("Invalid Stelar ERP Backup file");
      }
    } catch (e) {
      alert("Error parsing JSON file");
    }
  };

  const updateSalvageValue = (projectId: string, value: number) => {
    setData((prev: any) => ({
      ...prev,
      billing: {
        ...prev.billing,
        [projectId]: {
          ...(prev.billing[projectId] || {}),
          salvageValue: value
        }
      }
    }));
  };

  const value = {
    data,
    setData,
    resetData,
    getProjectTotal,
    updateVariationStatus,
    addVariation,
    addBoqItem,
    activeProjectId,
    setActiveProjectId,
    exportData,
    importData,
    updateSalvageValue
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppStore = () => useContext(AppContext);
