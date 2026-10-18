export interface InvoiceItem {
  id: string;
  item: string;
  category: "Body & Paint" | "Mechanical" | "Electrical" | "Labor & Teardown" | "Glass & Trim";
  claimedPkr: number;
  approvedPkr?: number;
  status?: "APPROVED" | "REJECTED" | "PARTIAL";
  reasonAndCitation?: string;
}

export interface PolicyRule {
  clauseNumber: string;
  clauseTitle: string;
  content: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  policyHolder: string;
  vehicleMakeModel: string;
  vehicleYear: number;
  vehicleRegNumber: string;
  vehicleColor: string;
  incidentDate: string;
  incidentType: string;
  incidentLocation: string;
  incidentDescription: string;
  expectedDamageZone: string;
  riskTier: "HIGH" | "LOW" | "MEDIUM";
  workshopName: string;
  workshopEstimateNumber: string;
  policyType: string;
  deductiblePkr: number;
  maxLiabilityPkr: number;
  damageSvg: string;
  policyRules: PolicyRule[];
  invoiceItems: InvoiceItem[];
}

export interface AgentDebateStep {
  agentId: "inspector" | "advocate" | "auditor" | "adjudicator";
  agentName: string;
  agentRole: string;
  badgeColor: string; // blue, emerald, amber, purple
  iconName: string;
  timestamp: string;
  summary: string;
  detailedAnalysis: string;
  citations: string[];
  findings?: {
    label: string;
    value: string;
    type?: "positive" | "warning" | "danger" | "neutral";
  }[];
  rawJson?: Record<string, unknown>;
}

export interface AdjudicationVerdict {
  claimId: string;
  fraudRiskScore: number; // 0 to 100
  riskLevel: "LOW RISK" | "MEDIUM SUSPICION" | "CRITICAL FRAUD ALERT";
  verdictStatus: "FULL_APPROVAL" | "PARTIAL_APPROVAL" | "CLAIM_REJECTED";
  claimedTotalPkr: number;
  approvedPayoutPkr: number;
  totalSavedFromFraudPkr: number;
  executiveSummary: string;
  evidenceInspectorSummary: string;
  policyAdvocateSummary: string;
  fraudAuditorSummary: string;
  lineItems: {
    id: string;
    item: string;
    claimedPkr: number;
    approvedPkr: number;
    status: "APPROVED" | "REJECTED" | "PARTIAL";
    category: string;
    reasonAndCitation: string;
  }[];
  policyCitationsApplied: string[];
  auditTimestamp: string;
  adjudicatorSignoff: string;
}

// Built-in Standard Policy Rules (Pak-Takaful Comprehensive Auto Standard)
export const STANDARD_POLICY_RULES: PolicyRule[] = [
  {
    clauseNumber: "Clause 4.2",
    clauseTitle: "Comprehensive Collision & Impact Indemnity",
    content: "The insurer shall indemnify the insured against sudden accidental external collision, overturning, and physical damage directly resulting from the declared incident.",
  },
  {
    clauseNumber: "Clause 5.1",
    clauseTitle: "Mandatory Teardown & Assessment Labor",
    content: "Reasonable workshop labor required to dismantle damaged components for adjuster inspection is admissible up to standard regional book rates.",
  },
  {
    clauseNumber: "Clause 6.1",
    clauseTitle: "OEM Parts Replacement Standard",
    content: "Damaged structural, lighting, or body panels that cannot be safely repaired shall be eligible for OEM equivalent parts subject to standard vehicle age depreciation.",
  },
  {
    clauseNumber: "Clause 9.3",
    clauseTitle: "Exclusion of Unrelated Pre-Existing / Concurrent Damage",
    content: "The insurer strictly disallows coverage for damages, wear & tear, or parts replacement located outside the kinetic point of declared impact or having no causal nexus to the reported collision.",
  },
  {
    clauseNumber: "Clause 11.4",
    clauseTitle: "Fraudulent Exaggeration & Parts Padding",
    content: "Any deliberate attempt to claim undamaged components, counterfeit invoices, or unauthorized upgrades (e.g. aftermarket electronics) shall result in immediate line rejection and referral to fraud audit.",
  },
];

// Sample Claims data
export const SAMPLE_CLAIMS: Claim[] = [
  {
    id: "claim-402",
    claimNumber: "CLM-2024-402",
    policyNumber: "POL-PK-88429",
    policyHolder: "M. Tariq Hashmi",
    vehicleMakeModel: "Honda Civic VTi Oriel (Reborn)",
    vehicleYear: 2009,
    vehicleRegNumber: "LEB-09-5481",
    vehicleColor: "Taffeta White",
    incidentDate: "2024-10-12 18:45 PKT",
    incidentType: "Rear-End Low-Speed Collision",
    incidentLocation: "Shahrah-e-Faisal near Baloch Colony Flyover, Karachi",
    incidentDescription:
      "Vehicle was stationary at a traffic signal and was rear-ended at approximately 20 km/h by a following delivery van. Impact was concentrated on the rear bumper cover, rear-left tail lamp cluster, and trunk lid alignment.",
    expectedDamageZone: "Rear Bumper & Rear-Left Tail Lamp",
    riskTier: "HIGH",
    workshopName: "Al-Rehman Precision Auto Works, Karachi",
    workshopEstimateNumber: "EST-2024-8841",
    policyType: "Comprehensive Private Motor Gold",
    deductiblePkr: 5000,
    maxLiabilityPkr: 2200000,
    damageSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%">
      <rect width="600" height="320" fill="%230f172a" rx="12"/>
      <defs>
        <radialGradient id="rearImpact" cx="20%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%23ef4444" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="%23f97316" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="%230f172a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Grid Lines -->
      <path d="M50 0v320 M150 0v320 M250 0v320 M350 0v320 M450 0v320 M550 0v320" stroke="%23334155" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <!-- Impact Heatmap Zone -->
      <circle cx="130" cy="180" r="110" fill="url(%23rearImpact)"/>
      <!-- Car Wireframe (Top-Down Silhouette) -->
      <!-- Rear is on the left, Front is on the right -->
      <path d="M120 100 C110 110, 105 130, 105 160 C105 190, 110 210, 120 220 L200 230 C250 232, 350 232, 440 228 L500 215 C520 200, 525 180, 525 160 C525 140, 520 120, 500 105 L440 92 C350 88, 250 88, 200 90 Z" fill="%231e293b" stroke="%2394a3b8" stroke-width="2.5"/>
      <!-- Windshield & Roof -->
      <path d="M220 110 L380 110 C410 110, 430 130, 430 160 C430 190, 410 210, 380 210 L220 210 C200 195, 200 125, 220 110 Z" fill="%23090d16" stroke="%2338bdf8" stroke-width="1.5" stroke-dasharray="3 2"/>
      <!-- Rear Impact Point Indicator -->
      <path d="M95 140 Q 120 160 95 180" stroke="%23ef4444" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="105" cy="145" r="7" fill="%23ef4444"/>
      <circle cx="105" cy="175" r="7" fill="%23ef4444"/>
      <line x1="95" y1="160" x2="40" y2="160" stroke="%23ef4444" stroke-width="2" stroke-dasharray="4 2"/>
      <text x="35" y="145" fill="%23ef4444" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="end">CRITICAL IMPACT</text>
      <text x="35" y="162" fill="%23fca5a5" font-family="sans-serif" font-size="10" text-anchor="end">Rear-Left Collision Point</text>
      <text x="35" y="177" fill="%23fca5a5" font-family="sans-serif" font-size="9" text-anchor="end">Bumper & Tail Lamp Crush</text>
      <!-- Front Area Intact Label -->
      <circle cx="510" cy="160" r="6" fill="%2310b981"/>
      <line x1="510" y1="160" x2="550" y2="160" stroke="%2310b981" stroke-width="2"/>
      <text x="555" y="155" fill="%2310b981" font-family="sans-serif" font-weight="bold" font-size="11">FRONT END INTACT</text>
      <text x="555" y="170" fill="%236ee7b7" font-family="sans-serif" font-size="9">Zero Impact / Bumper Clear</text>
      <!-- Suspect Part Overlay Warning (Front Headlight / Grille Padded) -->
      <rect x="470" y="85" width="45" height="30" fill="%23ef4444" fill-opacity="0.2" stroke="%23ef4444" stroke-width="1.5" stroke-dasharray="2 2" rx="4"/>
      <text x="470" y="78" fill="%23f87171" font-family="sans-serif" font-weight="bold" font-size="9">FRAUD: FRONT HID BILLED</text>
      <text x="300" y="300" fill="%2394a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">Visual Inspection: Impact localized solely to Rear Quarter (100% disconnect with front items)</text>
    </svg>`,
    policyRules: STANDARD_POLICY_RULES,
    invoiceItems: [
      {
        id: "item-1",
        item: "Rear Bumper Cover OEM Replacement",
        category: "Body & Paint",
        claimedPkr: 32000,
      },
      {
        id: "item-2",
        item: "Rear Bumper Dents & Painting (Taffeta White Oven Baked)",
        category: "Body & Paint",
        claimedPkr: 18000,
      },
      {
        id: "item-3",
        item: "Rear Left Tail Light Lens Assembly (Stanley OEM)",
        category: "Electrical",
        claimedPkr: 22000,
      },
      {
        id: "item-4",
        item: "Rear Chassis & Trunk Floor Alignment Pull Labor",
        category: "Labor & Teardown",
        claimedPkr: 10000,
      },
      {
        id: "item-5",
        item: "Front Bi-Xenon HID Projector Headlight Pair Assembly",
        category: "Electrical",
        claimedPkr: 68000, // HIGH FRAUD CONTRABAND!
      },
      {
        id: "item-6",
        item: "Front Sport Mesh Grille & Chrome Molding Trim",
        category: "Glass & Trim",
        claimedPkr: 35000, // HIGH FRAUD CONTRABAND!
      },
    ],
  },
  {
    id: "claim-409",
    claimNumber: "CLM-2024-409",
    policyNumber: "POL-PK-91024",
    policyHolder: "Dr. Ayesha Siddiqui",
    vehicleMakeModel: "Toyota Corolla Altis 1.6",
    vehicleYear: 2022,
    vehicleRegNumber: "ICT-22-8920",
    vehicleColor: "Phantom Bronze Metallic",
    incidentDate: "2024-09-28 16:10 PKT",
    incidentType: "Severe Hailstorm & Windshield Fracture",
    incidentLocation: "Murree Expressway, near Lower Topa Toll Plaza",
    incidentDescription:
      "Severe localized hailstorm with golf-ball sized ice pellets struck vehicle moving towards Islamabad. Laminated front windshield developed spiderweb impact fractures, with superficial micro-dents across the aluminum bonnet/hood panel.",
    expectedDamageZone: "Front Windshield & Hood Pitting",
    riskTier: "LOW",
    workshopName: "Toyota Islamabad Motors (3S Authorized Dealership)",
    workshopEstimateNumber: "EST-2024-11902",
    policyType: "Comprehensive Executive Motor Shield",
    deductiblePkr: 3000,
    maxLiabilityPkr: 6500000,
    damageSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="100%" height="100%">
      <rect width="600" height="320" fill="%230f172a" rx="12"/>
      <defs>
        <radialGradient id="hailImpact" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="%230284c7" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="%230f172a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Grid -->
      <path d="M50 0v320 M150 0v320 M250 0v320 M350 0v320 M450 0v320 M550 0v320" stroke="%23334155" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
      <!-- Windshield Hail Zone -->
      <circle cx="360" cy="160" r="90" fill="url(%23hailImpact)"/>
      <!-- Car Wireframe -->
      <path d="M120 100 C110 110, 105 130, 105 160 C105 190, 110 210, 120 220 L200 230 C250 232, 350 232, 440 228 L500 215 C520 200, 525 180, 525 160 C525 140, 520 120, 500 105 L440 92 C350 88, 250 88, 200 90 Z" fill="%231e293b" stroke="%2394a3b8" stroke-width="2.5"/>
      <!-- Windshield Wireframe -->
      <path d="M350 115 L410 115 C425 115, 435 135, 435 160 C435 185, 425 205, 410 205 L350 205 Z" fill="%230284c7" fill-opacity="0.3" stroke="%2338bdf8" stroke-width="2"/>
      <!-- Spiderweb Cracks -->
      <path d="M380 160 L365 140 M380 160 L395 145 M380 160 L370 180 M380 160 L395 175 M380 160 L410 160 M380 160 L355 160" stroke="%23ffffff" stroke-width="2" stroke-linecap="round"/>
      <circle cx="380" cy="160" r="3" fill="%23ffffff"/>
      <!-- Hail Dents on Hood -->
      <circle cx="440" cy="140" r="4" fill="%2338bdf8" stroke="%23e0f2fe" stroke-width="1"/>
      <circle cx="460" cy="170" r="5" fill="%2338bdf8" stroke="%23e0f2fe" stroke-width="1"/>
      <circle cx="475" cy="150" r="4" fill="%2338bdf8" stroke="%23e0f2fe" stroke-width="1"/>
      <!-- Labels -->
      <text x="380" y="80" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">WINDSHIELD SPIDERWEB CRACK</text>
      <text x="380" y="96" fill="%23bae6fd" font-family="sans-serif" font-size="10" text-anchor="middle">Laminated Acoustic Glass Rupture (Direct Hail Impact)</text>
      <text x="470" y="240" fill="%2310b981" font-family="sans-serif" font-weight="bold" font-size="11">HOOD PDR ADMISSIBLE</text>
      <text x="470" y="255" fill="%236ee7b7" font-family="sans-serif" font-size="9">Paintless Dent Repair (Zero Respray Needed)</text>
      <text x="300" y="300" fill="%2394a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">Visual Inspection: All claimed items align with declared natural weather event (100% Clean Audit)</text>
    </svg>`,
    policyRules: STANDARD_POLICY_RULES,
    invoiceItems: [
      {
        id: "item-101",
        item: "OEM Laminated Acoustic Windshield Glass (AGC Automotive)",
        category: "Glass & Trim",
        claimedPkr: 26000,
      },
      {
        id: "item-102",
        item: "Windshield Polyurethane Sealant & Molding Kit",
        category: "Glass & Trim",
        claimedPkr: 4500,
      },
      {
        id: "item-103",
        item: "Specialized Glass Removal & Installation Dealership Labor",
        category: "Labor & Teardown",
        claimedPkr: 4500,
      },
      {
        id: "item-104",
        item: "Hood Paintless Dent Repair (PDR) - 6 Micro Hail Dents",
        category: "Body & Paint",
        claimedPkr: 7000,
      },
    ],
  },
];
