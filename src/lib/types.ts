export type Language = 'en' | 'ur-roman';

export interface TaxSlab {
  min: number;
  max: number | null;
  baseTax: number;
  rate: number;
  description: string;
}

export interface SalaryTaxResult {
  monthlySalary: number;
  annualSalary: number;
  annualTax: number;
  monthlyTax: number;
  effectiveRate: number;
  takeHomeMonthly: number;
  slabDescription: string;
  breakdown: {
    slabRange: string;
    taxableAmountInSlab: number;
    ratePercent: number;
    taxAmount: number;
  }[];
}

export interface FreelancerTaxResult {
  monthlyIncomePKR: number;
  annualIncomePKR: number;
  isPsebRegistered: boolean;
  taxRatePercent: number;
  annualTax: number;
  monthlyTax: number;
  takeHomeMonthly: number;
  regime: string;
  notes: string[];
}

export interface WHTComparisonItem {
  category: string;
  section: string;
  description: string;
  filerRate: string;
  nonFilerRate: string;
  exampleBasis: number;
  filerCost: number;
  nonFilerCost: number;
  difference: number;
  lawReference: string;
}

export interface FBRNoticeSample {
  id: string;
  section: string;
  title: string;
  summaryEn: string;
  summaryUr: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  urgencyDays: number;
  actionRequiredEn: string[];
  actionRequiredUr: string[];
  penaltyDetails: string;
}

export interface ComplianceStep {
  id: string;
  title: string;
  titleUr: string;
  description: string;
  descriptionUr: string;
  estimatedTime: string;
  portalUrl?: string;
  portalName?: string;
  requiredDocuments: string[];
}

export interface ComplianceChecklist {
  id: string;
  title: string;
  titleUr: string;
  category: 'individual' | 'business' | 'freelancer' | 'corporate';
  description: string;
  steps: ComplianceStep[];
}

export interface VerifiedExpert {
  id: string;
  name: string;
  title: string;
  city: string;
  firm: string;
  specialization: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  verificationBadge: string;
  feeRange: string;
  phone: string;
}

export interface FBRNotification {
  id: string;
  sroNumber: string;
  date: string;
  category: 'Income Tax' | 'Sales Tax' | 'Customs' | 'Corporate';
  title: string;
  titleUr: string;
  summaryEn: string;
  summaryUr: string;
  impactOn: string[];
  downloadUrl?: string;
}
