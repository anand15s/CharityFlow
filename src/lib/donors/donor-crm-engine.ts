import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════════════════════════
// CHARITYFLOW — DONOR CRM ENGINE v1.0
// Production-grade donor relationship management
// ═══════════════════════════════════════════════════════════

export interface Donor {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  type: 'individual' | 'corporate' | 'foundation' | 'government' | 'anonymous';
  status: 'active' | 'lapsed' | 'prospect' | 'major' | 'recurring';
  tags: string[];
  notes: string[];
  engagementScore: number; // 0-100
  lifetimeValue: number;
  firstDonationDate?: Date;
  lastDonationDate?: Date;
  totalDonations: number;
  averageDonation: number;
  donationCount: number;
  preferredChannel: 'email' | 'phone' | 'mail' | 'in-person';
  communicationConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  donorId: string;
  organizationId: string;
  amount: number;
  currency: string;
  type: 'one-time' | 'recurring' | 'pledge' | 'in-kind' | 'matching';
  method: 'credit-card' | 'check' | 'cash' | 'bank-transfer' | 'online' | 'stock' | 'crypto' | 'in-kind';
  campaignId?: string;
  fundId?: string;
  designation: 'unrestricted' | 'restricted' | 'temporarily-restricted';
  taxDeductible: boolean;
  taxReceiptSent: boolean;
  taxReceiptDate?: Date;
  receiptNumber?: string;
  notes?: string;
  date: Date;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  type: 'general' | 'capital' | 'annual' | 'emergency' | 'event' | 'peer-to-peer' | 'matching';
  peerFundraisers?: PeerFundraiser[];
  createdAt: Date;
}

export interface PeerFundraiser {
  id: string;
  campaignId: string;
  fundraiserName: string;
  fundraiserEmail: string;
  personalGoal: number;
  raisedAmount: number;
  donorCount: number;
  pageUrl: string;
  status: 'active' | 'completed';
}

export interface TaxReceipt {
  id: string;
  donorId: string;
  donationId: string;
  organizationId: string;
  receiptNumber: string;
  amount: number;
  date: Date;
  taxYear: number;
  orgName: string;
  orgEIN: string;
  orgAddress: string;
  donorName: string;
  donorAddress: string;
  goodsProvided: boolean;
  goodsValue: number;
  deductibleAmount: number;
  quidProQuoDisclosure: string;
  generatedAt: Date;
}

export interface DonorAnalytics {
  totalDonors: number;
  activeDonors: number;
  lapsedDonors: number;
  newDonorsThisPeriod: number;
  retentionRate: number;
  averageGift: number;
  medianGift: number;
  totalRaised: number;
  recurringRevenue: number;
  recurringDonorCount: number;
  topDonors: { donor: Donor; totalGiven: number }[];
  donorsByType: Record<string, number>;
  donationsByMethod: Record<string, number>;
  monthlyTrend: { month: string; amount: number; count: number }[];
  engagementDistribution: { high: number; medium: number; low: number };
}

// ═══════════════════════════════════════════════════════════
// PLAIN LANGUAGE TRANSLATIONS
// ═══════════════════════════════════════════════════════════

const PLAIN_LANGUAGE: Record<string, string> = {
  'Donor CRM': 'Supporter Hub',
  'Engagement Score': 'Connection Strength',
  'Lifetime Value': 'Total Support Given',
  'Lapsed Donor': 'Supporter We Haven\'t Heard From',
  'Retention Rate': 'Supporters Who Came Back',
  'Recurring Donation': 'Monthly Gift',
  'Pledge': 'Promise to Give',
  'In-Kind Donation': 'Non-Cash Gift',
  'Designation': 'How to Use This Gift',
  'Unrestricted': 'Use Where Needed Most',
  'Restricted': 'Use Only for This Purpose',
  'Tax Receipt': 'Donation Thank-You Letter',
  'Quid Pro Quo': 'Something Given in Return',
  'Acknowledgment Letter': 'Thank-You Letter',
  'Campaign': 'Fundraising Drive',
  'Peer-to-Peer': 'Friends Helping Friends Fundraise',
  'Capital Campaign': 'Big Project Fund',
  'Annual Fund': 'Yearly Support Drive',
  'Matching Gift': 'Doubled Donation',
  'DAF': 'Donor-Advised Fund (Special Giving Account)',
  'Major Donor': 'Key Supporter',
  'Prospect': 'Potential Supporter',
};

export function translateDonorTerm(term: string): string {
  return PLAIN_LANGUAGE[term] || term;
}

// ═══════════════════════════════════════════════════════════
// DONOR MANAGEMENT
// ═══════════════════════════════════════════════════════════

export class DonorCRMEngine {
  private donors: Map<string, Donor> = new Map();
  private donations: Map<string, Donation> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private receipts: Map<string, TaxReceipt> = new Map();

  // ─── DONOR CRUD ───────────────────────────────────────

  createDonor(input: {
    organizationId: string;
    firstName: string;
    lastName: string;
    email: string;
    type?: Donor['type'];
    phone?: string;
    address?: Donor['address'];
    tags?: string[];
  }): Donor {
    if (!input.firstName?.trim()) throw new Error('First name is required');
    if (!input.lastName?.trim()) throw new Error('Last name is required');
    if (!input.email?.trim()) throw new Error('Email is required');
    if (!this.isValidEmail(input.email)) throw new Error('Invalid email format');

    // Check for duplicate email within org
    for (const donor of this.donors.values()) {
      if (donor.organizationId === input.organizationId && donor.email === input.email) {
        throw new Error('Donor with this email already exists');
      }
    }

    const donor: Donor = {
      id: uuidv4(),
      organizationId: input.organizationId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      address: input.address,
      type: input.type || 'individual',
      status: 'prospect',
      tags: input.tags || [],
      notes: [],
      engagementScore: 0,
      lifetimeValue: 0,
      totalDonations: 0,
      averageDonation: 0,
      donationCount: 0,
      preferredChannel: 'email',
      communicationConsent: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.donors.set(donor.id, donor);
    return donor;
  }

  getDonor(id: string): Donor | undefined {
    return this.donors.get(id);
  }

  updateDonor(id: string, updates: Partial<Donor>): Donor {
    const donor = this.donors.get(id);
    if (!donor) throw new Error('Donor not found');
    const updated = { ...donor, ...updates, id: donor.id, updatedAt: new Date() };
    this.donors.set(id, updated);
    return updated;
  }

  searchDonors(orgId: string, query: string): Donor[] {
    const q = query.toLowerCase();
    return Array.from(this.donors.values()).filter(
      d => d.organizationId === orgId && (
        d.firstName.toLowerCase().includes(q) ||
        d.lastName.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      )
    );
  }

  getDonorsByStatus(orgId: string, status: Donor['status']): Donor[] {
    return Array.from(this.donors.values()).filter(
      d => d.organizationId === orgId && d.status === status
    );
  }

  // ─── DONATION PROCESSING ──────────────────────────────

  recordDonation(input: {
    donorId: string;
    organizationId: string;
    amount: number;
    type?: Donation['type'];
    method?: Donation['method'];
    campaignId?: string;
    designation?: Donation['designation'];
    date?: Date;
    notes?: string;
  }): Donation {
    if (input.amount <= 0) throw new Error('Donation amount must be positive');

    const donor = this.donors.get(input.donorId);
    if (!donor) throw new Error('Donor not found');

    const donation: Donation = {
      id: uuidv4(),
      donorId: input.donorId,
      organizationId: input.organizationId,
      amount: Math.round(input.amount * 100) / 100,
      currency: 'USD',
      type: input.type || 'one-time',
      method: input.method || 'online',
      campaignId: input.campaignId,
      designation: input.designation || 'unrestricted',
      taxDeductible: true,
      taxReceiptSent: false,
      notes: input.notes,
      date: input.date || new Date(),
      createdAt: new Date(),
    };

    this.donations.set(donation.id, donation);

    // Update donor stats
    donor.donationCount += 1;
    donor.totalDonations += donation.amount;
    donor.lifetimeValue = donor.totalDonations;
    donor.averageDonation = donor.totalDonations / donor.donationCount;
    donor.lastDonationDate = donation.date;
    if (!donor.firstDonationDate) donor.firstDonationDate = donation.date;
    donor.status = input.type === 'recurring' ? 'recurring' : 'active';
    donor.updatedAt = new Date();
    this.donors.set(donor.id, donor);

    // Update campaign if linked
    if (input.campaignId) {
      const campaign = this.campaigns.get(input.campaignId);
      if (campaign) {
        campaign.raisedAmount += donation.amount;
        campaign.donorCount += 1;
        this.campaigns.set(campaign.id, campaign);
      }
    }

    // Update engagement score
    this.recalculateEngagement(donor.id);

    return donation;
  }

  getDonationsByDonor(donorId: string): Donation[] {
    return Array.from(this.donations.values()).filter(d => d.donorId === donorId);
  }

  getDonationsByCampaign(campaignId: string): Donation[] {
    return Array.from(this.donations.values()).filter(d => d.campaignId === campaignId);
  }

  // ─── CAMPAIGN MANAGEMENT ──────────────────────────────

  createCampaign(input: {
    organizationId: string;
    name: string;
    description: string;
    goalAmount: number;
    startDate: Date;
    endDate: Date;
    type?: Campaign['type'];
  }): Campaign {
    if (!input.name?.trim()) throw new Error('Campaign name is required');
    if (input.goalAmount <= 0) throw new Error('Goal amount must be positive');
    if (input.endDate <= input.startDate) throw new Error('End date must be after start date');

    const campaign: Campaign = {
      id: uuidv4(),
      organizationId: input.organizationId,
      name: input.name.trim(),
      description: input.description || '',
      goalAmount: input.goalAmount,
      raisedAmount: 0,
      donorCount: 0,
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'draft',
      type: input.type || 'general',
      peerFundraisers: [],
      createdAt: new Date(),
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  getCampaign(id: string): Campaign | undefined {
    return this.campaigns.get(id);
  }

  updateCampaignStatus(id: string, status: Campaign['status']): Campaign {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error('Campaign not found');
    campaign.status = status;
    this.campaigns.set(id, campaign);
    return campaign;
  }

  getCampaignProgress(id: string): { percentage: number; remaining: number; onTrack: boolean } {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error('Campaign not found');
    const percentage = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);
    const remaining = Math.max(0, campaign.goalAmount - campaign.raisedAmount);
    const now = new Date();
    const totalDays = (campaign.endDate.getTime() - campaign.startDate.getTime()) / 86400000;
    const elapsedDays = Math.max(1, (now.getTime() - campaign.startDate.getTime()) / 86400000);
    const expectedPercentage = (elapsedDays / totalDays) * 100;
    return { percentage, remaining, onTrack: percentage >= expectedPercentage * 0.8 };
  }

  // ─── PEER-TO-PEER FUNDRAISING ─────────────────────────

  addPeerFundraiser(campaignId: string, input: {
    fundraiserName: string;
    fundraiserEmail: string;
    personalGoal: number;
  }): PeerFundraiser {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error('Campaign not found');
    if (campaign.type !== 'peer-to-peer') throw new Error('Campaign is not peer-to-peer type');

    const fundraiser: PeerFundraiser = {
      id: uuidv4(),
      campaignId,
      fundraiserName: input.fundraiserName,
      fundraiserEmail: input.fundraiserEmail,
      personalGoal: input.personalGoal,
      raisedAmount: 0,
      donorCount: 0,
      pageUrl: `/fundraise/${campaignId}/${uuidv4().slice(0, 8)}`,
      status: 'active',
    };

    campaign.peerFundraisers = campaign.peerFundraisers || [];
    campaign.peerFundraisers.push(fundraiser);
    this.campaigns.set(campaignId, campaign);
    return fundraiser;
  }

  // ─── TAX RECEIPT GENERATION ───────────────────────────

  generateTaxReceipt(donationId: string, orgInfo: {
    name: string;
    ein: string;
    address: string;
  }): TaxReceipt {
    const donation = this.donations.get(donationId);
    if (!donation) throw new Error('Donation not found');

    const donor = this.donors.get(donation.donorId);
    if (!donor) throw new Error('Donor not found');

    const receipt: TaxReceipt = {
      id: uuidv4(),
      donorId: donor.id,
      donationId: donation.id,
      organizationId: donation.organizationId,
      receiptNumber: `RCP-${new Date().getFullYear()}-${String(this.receipts.size + 1).padStart(5, '0')}`,
      amount: donation.amount,
      date: donation.date,
      taxYear: donation.date.getFullYear(),
      orgName: orgInfo.name,
      orgEIN: orgInfo.ein,
      orgAddress: orgInfo.address,
      donorName: `${donor.firstName} ${donor.lastName}`,
      donorAddress: donor.address
        ? `${donor.address.street}, ${donor.address.city}, ${donor.address.state} ${donor.address.zip}`
        : 'Address not provided',
      goodsProvided: false,
      goodsValue: 0,
      deductibleAmount: donation.amount,
      quidProQuoDisclosure: donation.amount >= 250
        ? 'No goods or services were provided in exchange for this contribution.'
        : '',
      generatedAt: new Date(),
    };

    this.receipts.set(receipt.id, receipt);

    // Mark donation as receipt sent
    donation.taxReceiptSent = true;
    donation.taxReceiptDate = new Date();
    donation.receiptNumber = receipt.receiptNumber;
    this.donations.set(donationId, donation);

    return receipt;
  }

  generateAnnualStatement(donorId: string, taxYear: number, orgInfo: {
    name: string;
    ein: string;
    address: string;
  }): { donor: Donor; donations: Donation[]; totalDeductible: number; statementYear: number } {
    const donor = this.donors.get(donorId);
    if (!donor) throw new Error('Donor not found');

    const yearDonations = Array.from(this.donations.values()).filter(
      d => d.donorId === donorId && d.date.getFullYear() === taxYear && d.taxDeductible
    );

    const totalDeductible = yearDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
      donor,
      donations: yearDonations,
      totalDeductible,
      statementYear: taxYear,
    };
  }

  // ─── ENGAGEMENT SCORING ───────────────────────────────

  recalculateEngagement(donorId: string): number {
    const donor = this.donors.get(donorId);
    if (!donor) return 0;

    let score = 0;

    // Recency (0-30 points)
    if (donor.lastDonationDate) {
      const daysSinceLastDonation = Math.floor(
        (Date.now() - donor.lastDonationDate.getTime()) / 86400000
      );
      if (daysSinceLastDonation <= 30) score += 30;
      else if (daysSinceLastDonation <= 90) score += 20;
      else if (daysSinceLastDonation <= 180) score += 10;
      else if (daysSinceLastDonation <= 365) score += 5;
    }

    // Frequency (0-25 points)
    if (donor.donationCount >= 10) score += 25;
    else if (donor.donationCount >= 5) score += 20;
    else if (donor.donationCount >= 3) score += 15;
    else if (donor.donationCount >= 1) score += 10;

    // Monetary (0-25 points)
    if (donor.lifetimeValue >= 10000) score += 25;
    else if (donor.lifetimeValue >= 5000) score += 20;
    else if (donor.lifetimeValue >= 1000) score += 15;
    else if (donor.lifetimeValue >= 100) score += 10;
    else if (donor.lifetimeValue > 0) score += 5;

    // Status bonuses (0-20 points)
    if (donor.status === 'recurring') score += 20;
    else if (donor.status === 'major') score += 15;
    else if (donor.status === 'active') score += 10;

    score = Math.min(100, score);
    donor.engagementScore = score;
    this.donors.set(donorId, donor);
    return score;
  }

  // ─── ANALYTICS ────────────────────────────────────────

  getAnalytics(orgId: string): DonorAnalytics {
    const orgDonors = Array.from(this.donors.values()).filter(d => d.organizationId === orgId);
    const orgDonations = Array.from(this.donations.values()).filter(d => d.organizationId === orgId);

    const activeDonors = orgDonors.filter(d => d.status === 'active' || d.status === 'recurring' || d.status === 'major');
    const lapsedDonors = orgDonors.filter(d => d.status === 'lapsed');
    const totalRaised = orgDonations.reduce((sum, d) => sum + d.amount, 0);
    const recurringDonations = orgDonations.filter(d => d.type === 'recurring');

    const amounts = orgDonations.map(d => d.amount).sort((a, b) => a - b);
    const medianGift = amounts.length > 0 ? amounts[Math.floor(amounts.length / 2)] : 0;

    const donorsByType: Record<string, number> = {};
    orgDonors.forEach(d => { donorsByType[d.type] = (donorsByType[d.type] || 0) + 1; });

    const donationsByMethod: Record<string, number> = {};
    orgDonations.forEach(d => { donationsByMethod[d.method] = (donationsByMethod[d.method] || 0) + 1; });

    const topDonors = orgDonors
      .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
      .slice(0, 10)
      .map(d => ({ donor: d, totalGiven: d.lifetimeValue }));

    const high = orgDonors.filter(d => d.engagementScore >= 70).length;
    const medium = orgDonors.filter(d => d.engagementScore >= 30 && d.engagementScore < 70).length;
    const low = orgDonors.filter(d => d.engagementScore < 30).length;

    return {
      totalDonors: orgDonors.length,
      activeDonors: activeDonors.length,
      lapsedDonors: lapsedDonors.length,
      newDonorsThisPeriod: orgDonors.filter(d => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
        return d.createdAt >= thirtyDaysAgo;
      }).length,
      retentionRate: orgDonors.length > 0
        ? Math.round((activeDonors.length / orgDonors.length) * 100)
        : 0,
      averageGift: orgDonations.length > 0
        ? Math.round((totalRaised / orgDonations.length) * 100) / 100
        : 0,
      medianGift,
      totalRaised,
      recurringRevenue: recurringDonations.reduce((sum, d) => sum + d.amount, 0),
      recurringDonorCount: recurringDonations.length,
      topDonors,
      donorsByType,
      donationsByMethod,
      monthlyTrend: [],
      engagementDistribution: { high, medium, low },
    };
  }

  // ─── LAPSED DONOR DETECTION ───────────────────────────

  detectLapsedDonors(orgId: string, lapseDays: number = 365): Donor[] {
    const cutoff = new Date(Date.now() - lapseDays * 86400000);
    const lapsed: Donor[] = [];

    for (const donor of this.donors.values()) {
      if (
        donor.organizationId === orgId &&
        donor.status !== 'prospect' &&
        donor.status !== 'lapsed' &&
        donor.lastDonationDate &&
        donor.lastDonationDate < cutoff
      ) {
        donor.status = 'lapsed';
        this.donors.set(donor.id, donor);
        lapsed.push(donor);
      }
    }

    return lapsed;
  }

  // ─── HELPERS ──────────────────────────────────────────

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export default DonorCRMEngine;
