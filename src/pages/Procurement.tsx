import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, XCircle, ShieldAlert, Key } from 'lucide-react';
import { useAppStore } from '../store/AppProvider';

export default function Procurement() {
  const { data, activeProjectId } = useAppStore();
  const poRequests = data.pos.filter((p: any) => p.projectId === activeProjectId);
  const boqs = data.boqs.filter((b: any) => b.projectId === activeProjectId);
  const variations = data.variations.filter((v: any) => v.projectId === activeProjectId);

  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const toggleOverride = (id: string) => {
    setOverrides(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Procurement Gateway</h2>
        <p className="text-sm text-slate-500 mt-1">3-Way Match & Quantity Validation (SOP Section 7 & 10)</p>
      </div>

      <div className="grid gap-6">
        {poRequests.map((req: any) => {
          let sourceRef = null;
          let approvedLimit = 0;
          let isBlockedVariation = false;
          let variationStatus = '';

          if (req.isVariation) {
            sourceRef = variations.find((v: any) => v.id === req.variationId);
            if (sourceRef) {
              approvedLimit = sourceRef.qty * (1 + sourceRef.wastage / 100);
              variationStatus = sourceRef.status;
              if (sourceRef.status !== 'Client Approved') {
                isBlockedVariation = true;
              }
            }
          } else {
            sourceRef = boqs.find((b: any) => b.id === req.boqId);
            if (sourceRef) {
              approvedLimit = sourceRef.qty * (1 + sourceRef.wastage / 100);
            }
          }

          const isOverLimit = req.requestedQty > approvedLimit;
          const hasOverride = overrides[req.id];
          const canProceed = !isBlockedVariation && (!isOverLimit || hasOverride);

          return (
            <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{req.id}</h3>
                  <p className="text-slate-600 font-medium">{req.vendor} - {req.item}</p>
                  {req.isVariation && (
                    <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                      Linked to: {req.variationId} ({variationStatus})
                    </span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Base Qty</p>
                  <p className="text-xl font-black text-slate-700">{sourceRef ? sourceRef.qty : '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Approved Limit (+{sourceRef?.wastage}%)</p>
                  <p className="text-xl font-black text-slate-700">{approvedLimit.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Requested PO Qty</p>
                  <p className={`text-xl font-black ${isOverLimit ? 'text-red-600' : 'text-emerald-600'}`}>
                    {req.requestedQty}
                  </p>
                </div>
              </div>

              {isBlockedVariation ? (
                <div className="flex items-start space-x-3 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                  <ShieldAlert className="text-red-600 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold">Action Blocked: Variation Pending Client Approval</h4>
                    <p className="text-sm mt-1">This PO is linked to Addendum {req.variationId}, which is currently marked as <strong>{variationStatus}</strong>. The SOP strictly prohibits procurement for unapproved scope creep.</p>
                  </div>
                </div>
              ) : isOverLimit && !hasOverride ? (
                <div className="flex flex-col space-y-4 p-4 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="font-bold">3-Way Match Failed: Quantity Exceeds SOP Limit</h4>
                      <p className="text-sm mt-1">Requested quantity ({req.requestedQty}) exceeds the approved limit ({approvedLimit.toFixed(1)}). Submission blocked.</p>
                    </div>
                  </div>
                  <div className="border-t border-amber-200 pt-3 flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm font-bold text-amber-800 cursor-pointer">
                      <input type="checkbox" checked={hasOverride} onChange={() => toggleOverride(req.id)} className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" />
                      <span>MD Authorization Override</span>
                    </label>
                    <Key size={16} className="text-amber-600" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 transition-all">
                  <CheckCircle className="text-emerald-600 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold">{hasOverride ? 'MD Override Active' : 'Within SOP Tolerance'}</h4>
                    <p className="text-sm mt-1">{hasOverride ? 'Quantity override authorized for PO processing.' : 'Quantity requested is within the approved budgeted limits. PO can be processed.'}</p>
                    {req.status !== 'Approved' && (
                      <button className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors">Approve & Generate PO</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
