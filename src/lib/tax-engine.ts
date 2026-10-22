import { SalaryTaxResult, FreelancerTaxResult, WHTComparisonItem, FBRNoticeSample, ComplianceChecklist, VerifiedExpert, FBRNotification } from './types';

// Finance Act 2024-2025 Salaried Tax Slabs (Section Division I, Part I, First Schedule)
export const SALARY_SLABS = [
  { min: 0, max: 600000, baseTax: 0, rate: 0, label: 'Up to PKR 600,000' },
  { min: 600000, max: 1200000, baseTax: 0, rate: 0.05, label: 'PKR 600,001 to 1,200,000 (5%)' },
  { min: 1200000, max: 2200000, baseTax: 30000, rate: 0.15, label: 'PKR 1,200,001 to 2,200,000 (15%)' },
  { min: 2200000, max: 3200000, baseTax: 180000, rate: 0.25, label: 'PKR 2,200,001 to 3,200,000 (25%)' },
  { min: 3200000, max: 4100000, baseTax: 430000, rate: 0.30, label: 'PKR 3,200,001 to 4,100,000 (30%)' },
  { min: 4100000, max: null, baseTax: 700000, rate: 0.35, label: 'Exceeding PKR 4,100,000 (35%)' },
];

export function calculateSalaryTax(annualSalary: number): SalaryTaxResult {
  const monthlySalary = Math.round(annualSalary / 12);
  let annualTax = 0;
  let activeSlabLabel = 'Exempt';
  const breakdown: SalaryTaxResult['breakdown'] = [];

  if (annualSalary <= 600000) {
    breakdown.push({
      slabRange: '0 - 600,000',
      taxableAmountInSlab: annualSalary,
      ratePercent: 0,
      taxAmount: 0,
    });
  } else {
    for (const slab of SALARY_SLABS) {
      if (annualSalary > slab.min) {
        const slabUpper = slab.max ? Math.min(annualSalary, slab.max) : annualSalary;
        const taxableInThisSlab = slabUpper - slab.min;
        const taxInThisSlab = taxableInThisSlab * slab.rate;

        breakdown.push({
          slabRange: `${slab.min.toLocaleString()} - ${slab.max ? slab.max.toLocaleString() : 'above'}`,
          taxableAmountInSlab: taxableInThisSlab,
          ratePercent: slab.rate * 100,
          taxAmount: Math.round(taxInThisSlab),
        });

        if (slab.max === null || annualSalary <= slab.max) {
          annualTax = slab.baseTax + (annualSalary - slab.min) * slab.rate;
          activeSlabLabel = slab.label;
          break;
        }
      }
    }
  }

  // 10% Surcharge on taxable income exceeding PKR 10 million (Finance Act)
  let surcharge = 0;
  if (annualSalary > 10000000) {
    surcharge = annualTax * 0.10;
    annualTax += surcharge;
  }

  annualTax = Math.round(annualTax);
  const monthlyTax = Math.round(annualTax / 12);
  const effectiveRate = annualSalary > 0 ? Number(((annualTax / annualSalary) * 100).toFixed(2)) : 0;
  const takeHomeMonthly = monthlySalary - monthlyTax;

  return {
    monthlySalary,
    annualSalary,
    annualTax,
    monthlyTax,
    effectiveRate,
    takeHomeMonthly,
    slabDescription: activeSlabLabel,
    breakdown,
  };
}

export function calculateFreelancerTax(monthlyIncomeUSD: number, usdToPkrRate: number = 280, isPsebRegistered: boolean = true): FreelancerTaxResult {
  const monthlyIncomePKR = Math.round(monthlyIncomeUSD * usdToPkrRate);
  const annualIncomePKR = monthlyIncomePKR * 12;

  // Under Section 154A of Income Tax Ordinance 2001:
  // PSEB registered export of IT/ITeS: 0.25% Final Withholding Tax
  // Non-PSEB registered export of IT/ITeS: 1.0% Final Tax
  const taxRatePercent = isPsebRegistered ? 0.25 : 1.0;
  const annualTax = Math.round(annualIncomePKR * (taxRatePercent / 100));
  const monthlyTax = Math.round(annualTax / 12);
  const takeHomeMonthly = monthlyIncomePKR - monthlyTax;

  const notes = isPsebRegistered
    ? [
        'PSEB (Pakistan Software Export Board) registered IT freelancers enjoy the 0.25% concessionary final tax regime under Section 154A.',
        'Banking proceeds must be realized in foreign currency (PRC - Proceeds Realization Certificate required from your bank).',
        'Sales tax on IT export services is 0% across all provincial authorities (PRA, SRB, KPRA, BRA).'
      ]
    : [
        'Without PSEB registration, the applicable export tax is 1.0% under Section 154A.',
        'Registering with PSEB costs ~PKR 5,000-10,000/year and can save you 75% in taxes immediately.',
        'Non-export local client income is subject to normal business tax slabs (up to 35%).'
      ];

  return {
    monthlyIncomePKR,
    annualIncomePKR,
    isPsebRegistered,
    taxRatePercent,
    annualTax,
    monthlyTax,
    takeHomeMonthly,
    regime: isPsebRegistered ? 'Section 154A (PSEB 0.25% Final Tax)' : 'Section 154A (Unregistered 1% Final Tax)',
    notes,
  };
}

// Filer vs Non-Filer Withholding Tax Matrix
export const WHT_COMPARISON_DATA: WHTComparisonItem[] = [
  {
    category: 'Cash Withdrawal from Bank',
    section: 'Section 231AB / 236P',
    description: 'Cash withdrawals exceeding PKR 50,000 per day',
    filerRate: '0% (Exempt)',
    nonFilerRate: '0.6% to 0.9%',
    exampleBasis: 100000,
    filerCost: 0,
    nonFilerCost: 600,
    difference: 600,
    lawReference: 'Income Tax Ordinance 2001, Division VI Part IV',
  },
  {
    category: 'New Car Purchase / Registration (1300cc - 1800cc)',
    section: 'Section 231B',
    description: 'Advance tax on purchase or booking of motor vehicles',
    filerRate: '1.5% to 3%',
    nonFilerRate: '6% to 12% (Up to 4x higher)',
    exampleBasis: 6000000,
    filerCost: 180000,
    nonFilerCost: 540000,
    difference: 360000,
    lawReference: 'Finance Act 2024 Schedule 1 Part IV',
  },
  {
    category: 'Buying Immovable Property',
    section: 'Section 236K',
    description: 'Advance tax on purchase/allotment of property',
    filerRate: '3%',
    nonFilerRate: '10.5% - 15%',
    exampleBasis: 20000000,
    filerCost: 600000,
    nonFilerCost: 2400000,
    difference: 1800000,
    lawReference: 'Income Tax Ordinance 2001, Section 236K',
  },
  {
    category: 'Selling Immovable Property',
    section: 'Section 236C',
    description: 'Advance tax on sale/transfer of property',
    filerRate: '3%',
    nonFilerRate: '10%',
    exampleBasis: 20000000,
    filerCost: 600000,
    nonFilerCost: 2000000,
    difference: 1400000,
    lawReference: 'Income Tax Ordinance 2001, Section 236C',
  },
  {
    category: 'Bank Profit on Debt / Savings Account',
    section: 'Section 151',
    description: 'Withholding tax on bank profit/interest',
    filerRate: '15%',
    nonFilerRate: '35% (Double rate)',
    exampleBasis: 200000,
    filerCost: 30000,
    nonFilerCost: 70000,
    difference: 40000,
    lawReference: 'Income Tax Ordinance 2001, Division I Part III',
  },
  {
    category: 'Stock Dividend Income',
    section: 'Section 150',
    description: 'Tax deducted on stock dividends from PSX companies',
    filerRate: '15%',
    nonFilerRate: '30%',
    exampleBasis: 100000,
    filerCost: 15000,
    nonFilerCost: 30000,
    difference: 15000,
    lawReference: 'Income Tax Ordinance 2001, Section 150',
  },
];

// Sample FBR Notices for Explainer Module
export const SAMPLE_FBR_NOTICES: FBRNoticeSample[] = [
  {
    id: 'notice-114-4',
    section: 'Section 114(4)',
    title: 'Notice for Non-Filing of Income Tax Return',
    summaryEn: 'FBR has detected that your financial transactions (bank withdrawals, property/car purchases) indicate taxable income, but you have not submitted your annual tax return.',
    summaryUr: 'FBR ko pata chala hai ke aap ki transactions ya assets hain magar aap ne annual income tax return jama nahi karwai.',
    riskLevel: 'medium',
    urgencyDays: 15,
    actionRequiredEn: [
      'Login to FBR IRIS portal (iris.fbr.gov.pk).',
      'Prepare wealth statement and income declaration for the cited tax year.',
      'Submit the return before the deadline to avoid ex-parte provisional assessment under Section 122C.'
    ],
    actionRequiredUr: [
      'IRIS portal (iris.fbr.gov.pk) par login karein.',
      'Guzishta saal ki wealth statement aur income return file karein.',
      'Deedline se pehle reply jama karwayen taake Section 122C ka unilateral order na aaye.'
    ],
    penaltyDetails: 'Penalty under Section 182: 0.1% of tax payable per day of default, minimum PKR 1,000 and up to 25% of tax.',
  },
  {
    id: 'notice-122-9',
    section: 'Section 122(9) & 122(5A)',
    title: 'Show Cause Notice for Amendment of Assessment',
    summaryEn: 'The tax officer proposes to add unexplained funds or disallow expenses from your previously declared return, which would create a tax liability.',
    summaryUr: 'Tax officer ka kehna hai ke aap ki return mein kuch kharche ya assets unexplained hain aur un par mazeed tax lag sakta hai.',
    riskLevel: 'high',
    urgencyDays: 14,
    actionRequiredEn: [
      'Do not ignore this notice. Failure to reply allows the officer to pass an adverse order without your consent.',
      'Gather bank statements, invoices, and source of funds for the questioned amounts.',
      'Draft a formal written legal reply with documentary annexures or consult a Chartered Accountant/Tax Advocate.'
    ],
    actionRequiredUr: [
      'Is notice ko ignore hargiz na karein.',
      'Bank statements, utility bills, aur paison ke zarye (source of funds) ka documentary proof jama karein.',
      'Written legal reply file karein ya kisi professional CA se rabta karein.'
    ],
    penaltyDetails: 'Default surcharge @ 12% per annum under Section 205 + penalty up to 100% of tax sought to be evaded.',
  },
  {
    id: 'notice-176',
    section: 'Section 176',
    title: 'Notice for Production of Accounts & Information',
    summaryEn: 'FBR Commissioner requires you to produce specific bank accounts, ledgers, contracts, or asset details within a designated timeframe.',
    summaryUr: 'Tax authority ne aap se makhsoos accounts, bank statements, ya business records talab kiye hain.',
    riskLevel: 'medium',
    urgencyDays: 10,
    actionRequiredEn: [
      'Carefully read the schedule attached to identify the exact documents demanded.',
      'Provide only the specific documents requested; do not volunteer extraneous records.',
      'If additional time is needed, file an online adjournment request (adjournment under Section 176) before the due date.'
    ],
    actionRequiredUr: [
      'Notice ke sath lagi list check karein ke kon se kaghazat mangay gaye hain.',
      'Sirf mangi gayi information provide karein.',
      'Waqt darkar ho tou IRIS par waqt barhane ki adjournment request submit karein.'
    ],
    penaltyDetails: 'Non-compliance penalty of PKR 25,000 for the first default and PKR 50,000 for subsequent defaults under Section 182.',
  },
  {
    id: 'notice-214c',
    section: 'Section 214C / 177',
    title: 'Selection of Case for Comprehensive Tax Audit',
    summaryEn: 'Your case has been selected for comprehensive audit by computer ballot or Commissioner discretion. All books of accounts will be audited.',
    summaryUr: 'Aap ka case complete tax audit ke liye select ho chuka hai. Poore saal ke accounts aur kharche check honge.',
    riskLevel: 'critical',
    urgencyDays: 21,
    actionRequiredEn: [
      'Engage a qualified Chartered Accountant or Tax Lawyer immediately.',
      'Reconcile bank accounts with declared turnover, wealth increase, and tax credits.',
      'Ensure all business withholding tax statements (Section 165) are up-to-date.'
    ],
    actionRequiredUr: [
      'Fauran kisi qualified CA ya Tax Lawyer se contact karein.',
      'Bank turnover aur return ke numbers ko tally karein.',
      'Withholding tax statements aur ledgers audit ke liye ready karein.'
    ],
    penaltyDetails: 'Severe audit additions may result in demand notices with 100% penalties and bank account attachment under Section 140.',
  },
];

// Interactive Checklists Data
export const COMPLIANCE_CHECKLISTS: ComplianceChecklist[] = [
  {
    id: 'ntn-individual',
    title: 'Individual NTN & Filer Registration',
    titleUr: 'Individual NTN Aur Filer Banne Ka Tareeqa',
    category: 'individual',
    description: 'Step-by-step procedure to get an NTN and become an Active Taxpayer (ATL) in Pakistan.',
    steps: [
      {
        id: 'ntn-step-1',
        title: 'Gather Required Information',
        titleUr: 'Zaroori Maloomat Jama Karein',
        description: 'You will need: Valid original CNIC, SIM registered in your own CNIC, active email address, and paid residential electricity bill (copy).',
        descriptionUr: 'Apna asil CNIC, apne naam par registered mobile SIM, personal email, aur bijli ka bill ready karein.',
        estimatedTime: '15 mins',
        requiredDocuments: ['CNIC', 'Active Phone SIM', 'Email ID', 'Electricity Consumer Bill'],
      },
      {
        id: 'ntn-step-2',
        title: 'Create Account on FBR IRIS Portal',
        titleUr: 'FBR IRIS Portal Par Account Banayein',
        description: 'Visit iris.fbr.gov.pk. Click "Registration for Unregistered Person". Fill in your CNIC, mobile network, cell number, and email.',
        descriptionUr: 'iris.fbr.gov.pk par jayen aur "Registration for Unregistered Person" par click karein. Mobile aur email enter karein.',
        estimatedTime: '10 mins',
        portalUrl: 'https://iris.fbr.gov.pk',
        portalName: 'FBR IRIS Portal',
        requiredDocuments: ['SMS & Email OTPs'],
      },
      {
        id: 'ntn-step-3',
        title: 'Verify Dual OTP Codes',
        titleUr: 'Mobile Aur Email OTP Verify Karein',
        description: 'Enter the 4-digit code sent to your SMS and the 4-digit code sent to your Email simultaneously.',
        descriptionUr: 'Mobile par aya SMS code aur email par aya code enter karke submit karein.',
        estimatedTime: '5 mins',
        requiredDocuments: [],
      },
      {
        id: 'ntn-step-4',
        title: 'Receive IRIS Login Credentials & PIN',
        titleUr: 'Password Aur 4-Digit PIN Recieve Karein',
        description: 'FBR will immediately send your System Password and 4-digit Transaction PIN via SMS and email. Keep your PIN safe; it is required to sign returns.',
        descriptionUr: 'SMS aur email par FBR ka login password aur 4-digit PIN mil jayega. Yeh PIN return sign karne ke kaam aata hai.',
        estimatedTime: '2 mins',
        requiredDocuments: [],
      },
      {
        id: 'ntn-step-5',
        title: 'File First Income Tax Return (Form 114)',
        titleUr: 'Pehli Income Tax Return File Karein',
        description: 'Login to IRIS. Click "Declaration" -> "Salary / Normal Return". Declare your salary/income and wealth statement (assets & liabilities). Submit using your PIN.',
        descriptionUr: 'IRIS mein login karke Declaration mein ja kar income aur assets declare karein aur PIN se verify karein.',
        estimatedTime: '30 mins',
        portalUrl: 'https://iris.fbr.gov.pk',
        portalName: 'IRIS Declaration Menu',
        requiredDocuments: ['Salary Slips / Bank Statement', 'Asset Records'],
      },
      {
        id: 'ntn-step-6',
        title: 'Check Active Taxpayer Status (ATL)',
        titleUr: 'Active Taxpayer List (ATL) Mein Naam Check Karein',
        description: 'Your status updates to "Active" on the ATL list within 24-48 hours. You can also verify via SMS: type "ATL <CNIC without dashes>" and send to 9966.',
        descriptionUr: 'FBR ki list mein naam 24-48 ghante mein active hota hai. 9966 par "ATL <CNIC>" bhej kar verify karein.',
        estimatedTime: '1 min',
        portalUrl: 'https://fbr.gov.pk/download-atl/132041',
        portalName: 'FBR Active Taxpayer Verification',
        requiredDocuments: [],
      },
    ],
  },
  {
    id: 'freelancer-pseb',
    title: 'IT Freelancer PSEB Registration (0.25% Tax)',
    titleUr: 'Freelancer PSEB Registration Guide (0.25% Tax)',
    category: 'freelancer',
    description: 'Procedure to register with Pakistan Software Export Board to legally qualify for the 0.25% concessionary export tax rate.',
    steps: [
      {
        id: 'pseb-1',
        title: 'Individual NTN & Filer Status',
        titleUr: 'NTN Aur Filer Status Check',
        description: 'Ensure you already have an Active NTN on the FBR ATL list.',
        descriptionUr: 'Pehle confirm karein ke aapka NTN active hai.',
        estimatedTime: '5 mins',
        requiredDocuments: ['Active NTN'],
      },
      {
        id: 'pseb-2',
        title: 'Open Freelancer Digital Bank Account',
        titleUr: 'Freelancer Foreign Currency / Exporters Account',
        description: 'Open a dedicated Freelancer Digital Account (Meezan, HBL, Standard Chartered, UBL, or Nayapay/Sadapay Exporter). Ensure the account is tagged for IT export proceeds.',
        descriptionUr: 'Bank mein Freelancer Account khulwayen taake payments proper banking channel se ayen.',
        estimatedTime: '1-2 days',
        requiredDocuments: ['Work contracts / Upwork/Fiverr Profile proof', 'CNIC'],
      },
      {
        id: 'pseb-3',
        title: 'Apply on PSEB Portal',
        titleUr: 'PSEB Portal Par Application Submit Karein',
        description: 'Visit pseb.org.pk -> "Freelancer Registration". Fill in your personal profile, services offered (Software, Design, Content, Marketing), and bank details.',
        descriptionUr: 'pseb.org.pk par Freelancer Registration form bharein.',
        estimatedTime: '20 mins',
        portalUrl: 'https://pseb.org.pk',
        portalName: 'PSEB Registration Portal',
        requiredDocuments: ['CNIC Copy', 'Upwork/Fiverr/Direct Client Invoices', 'Bank Maintenance Certificate'],
      },
      {
        id: 'pseb-4',
        title: 'Pay PSEB Registration Fee',
        titleUr: 'PSEB Registration Fee Ada Karein',
        description: 'Pay the annual fee (currently PKR 5,000 - 10,000 depending on category) via 1Link / Kuickpay / Online banking.',
        descriptionUr: '1Link ya online banking se fee ada karein.',
        estimatedTime: '5 mins',
        requiredDocuments: ['Paid Challan Proof'],
      },
      {
        id: 'pseb-5',
        title: 'Submit Certificate to Your Bank for 0.25% Deduction',
        titleUr: 'Bank Ko PSEB Certificate Submit Karwayen',
        description: 'Provide your PSEB Certificate to your bank branch. The bank will tag inward remittances under Section 154A for 0.25% deduction instead of 1% or higher.',
        descriptionUr: 'Bank ko PSEB certificate dein taake bank remittance par sirf 0.25% tax kaate.',
        estimatedTime: '1 day',
        requiredDocuments: ['PSEB Registration Certificate'],
      },
    ],
  },
  {
    id: 'secp-pvt-ltd',
    title: 'SECP Private Limited Company Incorporation',
    titleUr: 'SECP Private Limited Company Register Karwane Ka Tareeqa',
    category: 'corporate',
    description: 'Complete process to incorporate a Private Limited (Pvt Ltd) company with Securities & Exchange Commission of Pakistan.',
    steps: [
      {
        id: 'secp-1',
        title: 'Name Reservation via SECP eServices',
        titleUr: 'Company Ka Naam Reserve Karein',
        description: 'Login to eservices.secp.gov.pk. Search available names and submit 3 name choices. Ensure no prohibited words are used.',
        descriptionUr: 'eServices portal par ja kar company ka unique naam search aur reserve karein.',
        estimatedTime: '1 day',
        portalUrl: 'https://eservices.secp.gov.pk',
        portalName: 'SECP eServices Portal',
        requiredDocuments: ['Proposed Company Names', 'CNICs of Directors'],
      },
      {
        id: 'secp-2',
        title: 'Draft Memorandum & Articles of Association (MOA & AOA)',
        titleUr: 'MOA Aur AOA Tayyar Karein',
        description: 'Define company principal line of business, authorized share capital (e.g. PKR 100,000), and internal governance rules.',
        descriptionUr: 'Company ka business objective aur shares ki taqseem tay karein.',
        estimatedTime: '2-3 days',
        requiredDocuments: ['MOA & AOA Draft'],
      },
      {
        id: 'secp-3',
        title: 'Combined Incorporation & Automatic FBR NTN',
        titleUr: 'SECP Combined Form Aur FBR NTN',
        description: 'Submit Form II (Incorporation). Thanks to SECP-FBR one-window reforms, company NTN is generated automatically upon certificate issuance.',
        descriptionUr: 'Incorporation application submit karein. SECP aur FBR ka one-window system khud bakhud NTN generate kar deta hai.',
        estimatedTime: '2-4 days',
        portalUrl: 'https://eservices.secp.gov.pk',
        portalName: 'SECP eServices',
        requiredDocuments: ['Subscriber CNICs', 'Office Lease / Utility Bill'],
      },
    ],
  },
];

// Verified Experts Directory
export const VERIFIED_EXPERTS: VerifiedExpert[] = [
  {
    id: 'exp-1',
    name: 'Muhammad Tariq Khan, FCA',
    title: 'Fellow Chartered Accountant (ICAP)',
    city: 'Karachi',
    firm: 'Tariq & Co. Chartered Accountants',
    specialization: ['FBR Tax Audits', 'Corporate Tax', 'Appeals (Commissioner & ATIR)', 'SECP Compliance'],
    experienceYears: 16,
    rating: 4.9,
    reviewsCount: 84,
    verificationBadge: 'Verified ICAP Fellow',
    feeRange: 'PKR 15,000 - 50,000 / case',
    phone: '+92 21 3587 9000',
  },
  {
    id: 'exp-2',
    name: 'Advocate Zainab Rehman',
    title: 'High Court Advocate & Tax Practitioner',
    city: 'Lahore',
    firm: 'Rehman Tax & Legal Chambers',
    specialization: ['Show Cause Notices', 'Section 122 Amendments', 'High Court Writ Petitions', 'FTO Complaints'],
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 62,
    verificationBadge: 'Verified Bar Council Advocate',
    feeRange: 'PKR 20,000 - 60,000 / case',
    phone: '+92 42 3723 4400',
  },
  {
    id: 'exp-3',
    name: 'Bilal Ahmed Hashmi, ACA',
    title: 'Associate Chartered Accountant',
    city: 'Islamabad / Rawalpindi',
    firm: 'Hashmi Advisory Group',
    specialization: ['Freelancers & Tech Startups', 'PSEB 0.25% Tax Regime', 'SECP Incorporation', 'Foreign Remittance Compliance'],
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 110,
    verificationBadge: 'Verified Tech Tax Specialist',
    feeRange: 'PKR 10,000 - 30,000 / case',
    phone: '+92 51 289 1200',
  },
  {
    id: 'exp-4',
    name: 'Hassan Raza Farooqi',
    title: 'Senior Tax Consultant & Sales Tax Specialist',
    city: 'Faisalabad',
    firm: 'Farooqi & Associates',
    specialization: ['Sales Tax (PRA/FBR)', 'STRN Registration', 'E-Invoicing & POS Integration', 'Textile & Trade Audits'],
    experienceYears: 14,
    rating: 4.7,
    reviewsCount: 47,
    verificationBadge: 'Verified Tax Consultant',
    feeRange: 'PKR 15,000 - 45,000 / case',
    phone: '+92 41 854 3300',
  },
];

// FBR Notifications Sample Feed
export const FBR_NOTIFICATIONS: FBRNotification[] = [
  {
    id: 'sro-1024',
    sroNumber: 'S.R.O. 1024(I)/2024',
    date: '12 Oct 2024',
    category: 'Income Tax',
    title: 'Implementation of Enhanced Withholding Tax on Non-Filers Purchasing Immovable Property',
    titleUr: 'Non-Filers Ke Liye Property Khareedne Par Surcharge Aur Extra Withholding Tax Ka Nifaz',
    summaryEn: 'FBR has notified progressive advance tax rates up to 15% under Section 236K for individuals who do not appear on the Active Taxpayer List (ATL) at the time of purchase.',
    summaryUr: 'FBR ne Section 236K ke tehat non-filers ke liye property ki khareed par tax 15% tak barha diya hai.',
    impactOn: ['Property Buyers', 'Real Estate Investors', 'Non-Filers'],
    downloadUrl: 'https://fbr.gov.pk',
  },
  {
    id: 'sro-988',
    sroNumber: 'S.R.O. 988(I)/2024',
    date: '28 Sep 2024',
    category: 'Sales Tax',
    title: 'Mandatory Digital Invoicing & POS Integration for Tier-1 Retailers',
    titleUr: 'Tier-1 Retailers Ke Liye Real-Time Digital Invoicing Aur FBR POS System Lazmi Qarar',
    summaryEn: 'Retail businesses operating with covered area exceeding 1,000 sq ft or electricity bills exceeding PKR 1.2M annually must integrate with FBR real-time POS invoicing.',
    summaryUr: 'Baray retailers aur shopping malls ke liye FBR ka digital POS system lagana qanooni taur par lazmi hai.',
    impactOn: ['Retail Businesses', 'Supermarkets', 'Consumer Brands'],
    downloadUrl: 'https://fbr.gov.pk',
  },
  {
    id: 'sro-910',
    sroNumber: 'Circular No. 04 of 2024',
    date: '15 Aug 2024',
    category: 'Income Tax',
    title: 'Clarification Regarding 0.25% Tax on IT & IT Enabled Services (ITeS) Exports',
    titleUr: 'IT Aur Freelancers Ki Foreign Remittances Par 0.25% Concessionary Tax Ki Wazahat',
    summaryEn: 'FBR clarifies that IT freelancers and companies registered with PSEB receiving remittances via banking channels are subjected to a 0.25% final tax deduction without minimum turnover restrictions.',
    summaryUr: 'FBR ne confirm kiya hai ke PSEB registered freelancers par 0.25% final tax hi lagega aur koi extra audit tax nahi hoga.',
    impactOn: ['Software Engineers', 'Fiverr/Upwork Freelancers', 'Tech Agencies'],
    downloadUrl: 'https://fbr.gov.pk',
  },
];
