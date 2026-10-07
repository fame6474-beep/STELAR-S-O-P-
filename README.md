# STELAR ERP - Project Budget & Cost Control System

![Version](https://img.shields.io/badge/Version-1.0-emerald)
![SOP](https://img.shields.io/badge/SOP-SI--FIN--001-D4AF37)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-blue)

A production-ready Enterprise Resource Planning (ERP) web application designed exclusively for **Stelar Interiors Pvt. Ltd.** to enforce standard operating procedure **SI-FIN-001 (Project Budget Allocation & Cost Control)**.

---

## 🏛 System Overview & SOP Compliance Matrix

Stelar ERP is built to bridge the gap between interior design estimation and actual site execution. It strictly enforces standard thresholds to protect project profit margins and immediately flags deviations for Managing Director (MD) approval.

| SOP Section | Feature Implemented | Enforcement / Guardrail |
| :--- | :--- | :--- |
| **Sec 3: Allocations** | Dynamic P&L Dashboard | Flags any cost head (Materials, Labour, Overheads) exceeding the target % threshold in red. |
| **Sec 5 & 6: BOQ/Wastage** | Smart BOQ Builder | Hard-stop if material wastage exceeds max cap (e.g. 8% for Plywood). Requires MD justification. |
| **Sec 7 & 10: Procurement**| PO Gateway & 3-Way Match | Blocks PO creation if `Qty > BOQ Qty * (1 + Wastage)`. Blocks POs linked to unapproved variations. |
| **Sec 9: Labour Ledger** | Factory vs. Site Tracking | Segregates labour spends to enforce the 5-8% (Factory) and 12-15% (Site) caps. |
| **Sec 14: Closeout** | Executive Audit Report | Reconciles As-Built Qty vs BOQ, applies Salvage Scrap credits against overheads, and tracks DLP Retention. |

---

## 🚀 Quickstart & Deployment Procedures

### Local Development (Estimation Team)
1. **Install Dependencies:** `npm install`
2. **Start Development Server:** `npm run dev`
3. **Access Application:** Navigate to `http://localhost:5173`

### Production Deployment (IT Team)
The application is optimized for containerized deployment using Nginx.
1. **Build Docker Image:**
   ```bash
   docker build -t stelar-erp:latest .
   ```
2. **Run the Container:**
   ```bash
   docker run -d -p 8080:80 --name stelar-erp stelar-erp:latest
   ```
3. **Access Production Build:** Navigate to `http://localhost:8080`

---

## 💾 Data Structure & Backup Procedures

Stelar ERP operates on a decentralized, privacy-first **Local Database Engine** utilizing `LocalStorage`. This ensures lightning-fast performance without requiring a continuous internet connection on remote sites.

### Offline Backup & Restore for Estimators
*   **To Backup:** Click the **"Backup"** icon in the bottom left sidebar. This will instantly export a `.json` schema of all your Projects, BOQs, POs, Billing, and Variations.
*   **To Restore / Transfer:** Click the **"Restore"** icon, select your `.json` backup file, and the ERP will instantly hydrate the state. Perfect for transferring a project from a site laptop to the main office.
*   **Demo Reset:** Click **"Reset Demo Data"** to restore the default Stelar test projects (`SI-2026-001`, `SI-2026-002`, `SI-2026-003`).

---

## 🧮 Key Business Logic Formulas

Stelar ERP automates the complex formulas defined in SI-FIN-001:

1. **BOQ Costing & Procurement Limit:**
   `Approved Limit = BOQ Qty * (1 + Approved Wastage %)`
   *If a PO requests 47 sheets of plywood against a 45 sheet BOQ with 6% wastage, `45 * 1.06 = 47.7`. The PO is within limits and auto-approved.*

2. **Baseline Recalibration (Scope Creep):**
   `Revised Contract Value = Original Baseline + SUM(Approved Variations)`
   *Once a Variation Order is marked "Client Approved", the ERP dynamically recalculates the Dashboard's target budget allocations against the new total.*

3. **Cash Flow Gap Analysis:**
   `Cash Flow Health = Total Client Collections - Total Incurred Payouts`
   *Alerts the Project Manager via an amber badge if cash flow turns negative.*

4. **Scrap Deduction:**
   `Net Site Overheads = Gross Site Overheads - Site Salvage & Scrap Recovery`
   *Selling leftover site materials (plywood offcuts, metal) directly offsets project overhead costs in the final MD Audit Report.*

---
*Generated for Stelar Interiors Pvt. Ltd. | Confidential & Proprietary*
