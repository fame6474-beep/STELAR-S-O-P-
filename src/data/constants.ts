export const STANDARD_ALLOCATION = [
  { id: 'materials', name: 'Materials', min: 45, max: 50 },
  { id: 'site_labour', name: 'Site Labour / Installation', min: 12, max: 15 },
  { id: 'factory_labour', name: 'Factory / Production Labour', min: 5, max: 8 },
  { id: 'design_pm', name: 'Design & Project Management', min: 4, max: 6 },
  { id: 'hardware', name: 'Hardware & Accessories', min: 5, max: 7 },
  { id: 'transport', name: 'Transportation & Logistics', min: 2, max: 4 },
  { id: 'wastage', name: 'Wastage / Rework Provision', min: 2, max: 3 },
  { id: 'site_overheads', name: 'Site Overheads / Consumables', min: 2, max: 3 },
  { id: 'company_overhead', name: 'Company Overhead Allocation', min: 4, max: 6 },
  { id: 'profit', name: 'Target Net Profit', min: 10, max: 15 },
];

export const STANDARD_WASTAGE: Record<string, { min: number; max: number }> = {
  'Plywood': { min: 5, max: 8 },
  'MDF': { min: 5, max: 8 },
  'WPC': { min: 5, max: 8 },
  'Laminate': { min: 5, max: 10 },
  'Edge Band': { min: 3, max: 5 },
  'Gypsum Board': { min: 5, max: 10 },
  'Gypsum Channel': { min: 3, max: 5 },
  'Glass': { min: 3, max: 5 },
  'Tiles': { min: 5, max: 10 },
  'Paint / Polish': { min: 3, max: 5 },
  'Hardware': { min: 2, max: 5 },
  'Electrical / Plumbing': { min: 2, max: 5 },
};

export const MATERIAL_TYPES = Object.keys(STANDARD_WASTAGE);
