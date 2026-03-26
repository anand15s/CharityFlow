import { DonorCRMEngine, translateDonorTerm } from '../lib/donors/donor-crm-engine';

describe('DonorCRMEngine', () => {
  let engine: DonorCRMEngine;
  const ORG_ID = 'org-test-001';
  const ORG_INFO = { name: 'Test Nonprofit', ein: '12-3456789', address: '123 Main St, Oklahoma City, OK 73102' };

  beforeEach(() => {
    engine = new DonorCRMEngine();
  });

  // ═══════════════════════════════════════════════════════
  // PLAIN LANGUAGE TRANSLATION
  // ═══════════════════════════════════════════════════════
  describe('Plain Language Translation', () => {
    test('translates Donor CRM to Supporter Hub', () => {
      expect(translateDonorTerm('Donor CRM')).toBe('Supporter Hub');
    });
    test('translates Engagement Score to Connection Strength', () => {
      expect(translateDonorTerm('Engagement Score')).toBe('Connection Strength');
    });
    test('translates Lapsed Donor to friendly term', () => {
      expect(translateDonorTerm('Lapsed Donor')).toBe("Supporter We Haven\'t Heard From");
    });
    test('returns original for unknown terms', () => {
      expect(translateDonorTerm('Unknown Term')).toBe('Unknown Term');
    });
  });

  // ═══════════════════════════════════════════════════════
  // DONOR CRUD
  // ═══════════════════════════════════════════════════════
  describe('Donor Management', () => {
    test('creates donor with valid input', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'John', lastName: 'Smith', email: 'john@test.com' });
      expect(donor.id).toBeDefined();
      expect(donor.firstName).toBe('John');
      expect(donor.status).toBe('prospect');
      expect(donor.engagementScore).toBe(0);
    });

    test('rejects empty first name', () => {
      expect(() => engine.createDonor({ organizationId: ORG_ID, firstName: '', lastName: 'Smith', email: 'a@b.com' }))
        .toThrow('First name is required');
    });

    test('rejects invalid email', () => {
      expect(() => engine.createDonor({ organizationId: ORG_ID, firstName: 'A', lastName: 'B', email: 'notanemail' }))
        .toThrow('Invalid email format');
    });

    test('rejects duplicate email in same org', () => {
      engine.createDonor({ organizationId: ORG_ID, firstName: 'A', lastName: 'B', email: 'dup@test.com' });
      expect(() => engine.createDonor({ organizationId: ORG_ID, firstName: 'C', lastName: 'D', email: 'dup@test.com' }))
        .toThrow('Donor with this email already exists');
    });

    test('allows same email in different orgs', () => {
      engine.createDonor({ organizationId: 'org-1', firstName: 'A', lastName: 'B', email: 'same@test.com' });
      const donor2 = engine.createDonor({ organizationId: 'org-2', firstName: 'C', lastName: 'D', email: 'same@test.com' });
      expect(donor2.id).toBeDefined();
    });

    test('searches donors by name', () => {
      engine.createDonor({ organizationId: ORG_ID, firstName: 'Alice', lastName: 'Wonder', email: 'alice@test.com' });
      engine.createDonor({ organizationId: ORG_ID, firstName: 'Bob', lastName: 'Builder', email: 'bob@test.com' });
      const results = engine.searchDonors(ORG_ID, 'alice');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Alice');
    });

    test('updates donor fields', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Test', lastName: 'User', email: 'test@test.com' });
      const updated = engine.updateDonor(donor.id, { phone: '555-1234', tags: ['vip'] });
      expect(updated.phone).toBe('555-1234');
      expect(updated.tags).toContain('vip');
    });
  });

  // ═══════════════════════════════════════════════════════
  // DONATION PROCESSING
  // ═══════════════════════════════════════════════════════
  describe('Donation Processing', () => {
    test('records donation and updates donor stats', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com' });
      const donation = engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 500 });
      expect(donation.amount).toBe(500);
      const updatedDonor = engine.getDonor(donor.id);
      expect(updatedDonor?.donationCount).toBe(1);
      expect(updatedDonor?.lifetimeValue).toBe(500);
      expect(updatedDonor?.status).toBe('active');
    });

    test('rejects zero/negative donation', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'A', lastName: 'B', email: 'neg@test.com' });
      expect(() => engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 0 }))
        .toThrow('Donation amount must be positive');
    });

    test('tracks recurring donations', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Rec', lastName: 'Donor', email: 'rec@test.com' });
      engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 50, type: 'recurring' });
      expect(engine.getDonor(donor.id)?.status).toBe('recurring');
    });

    test('links donation to campaign', () => {
      const campaign = engine.createCampaign({ organizationId: ORG_ID, name: 'Test', description: 'Test', goalAmount: 10000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31') });
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Camp', lastName: 'Donor', email: 'camp@test.com' });
      engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 1000, campaignId: campaign.id });
      const updated = engine.getCampaign(campaign.id);
      expect(updated?.raisedAmount).toBe(1000);
      expect(updated?.donorCount).toBe(1);
    });
  });

  // ═══════════════════════════════════════════════════════
  // CAMPAIGN MANAGEMENT
  // ═══════════════════════════════════════════════════════
  describe('Campaign Management', () => {
    test('creates campaign with valid input', () => {
      const campaign = engine.createCampaign({ organizationId: ORG_ID, name: 'Annual Fund', description: 'Yearly drive', goalAmount: 50000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31') });
      expect(campaign.status).toBe('draft');
      expect(campaign.goalAmount).toBe(50000);
    });

    test('rejects negative goal', () => {
      expect(() => engine.createCampaign({ organizationId: ORG_ID, name: 'Bad', description: '', goalAmount: -100, startDate: new Date(), endDate: new Date('2027-01-01') }))
        .toThrow('Goal amount must be positive');
    });

    test('rejects end before start', () => {
      expect(() => engine.createCampaign({ organizationId: ORG_ID, name: 'Bad', description: '', goalAmount: 1000, startDate: new Date('2027-01-01'), endDate: new Date('2026-01-01') }))
        .toThrow('End date must be after start date');
    });

    test('tracks campaign progress', () => {
      const campaign = engine.createCampaign({ organizationId: ORG_ID, name: 'Progress Test', description: '', goalAmount: 10000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31') });
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Prog', lastName: 'Test', email: 'prog@test.com' });
      engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 2500, campaignId: campaign.id });
      const progress = engine.getCampaignProgress(campaign.id);
      expect(progress.percentage).toBe(25);
      expect(progress.remaining).toBe(7500);
    });
  });

  // ═══════════════════════════════════════════════════════
  // PEER-TO-PEER FUNDRAISING
  // ═══════════════════════════════════════════════════════
  describe('Peer-to-Peer Fundraising', () => {
    test('adds fundraiser to P2P campaign', () => {
      const campaign = engine.createCampaign({ organizationId: ORG_ID, name: 'P2P Drive', description: '', goalAmount: 20000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), type: 'peer-to-peer' });
      const fundraiser = engine.addPeerFundraiser(campaign.id, { fundraiserName: 'Sarah', fundraiserEmail: 'sarah@test.com', personalGoal: 1000 });
      expect(fundraiser.pageUrl).toContain('/fundraise/');
      expect(fundraiser.status).toBe('active');
    });

    test('rejects P2P on non-P2P campaign', () => {
      const campaign = engine.createCampaign({ organizationId: ORG_ID, name: 'Regular', description: '', goalAmount: 5000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), type: 'general' });
      expect(() => engine.addPeerFundraiser(campaign.id, { fundraiserName: 'A', fundraiserEmail: 'a@b.com', personalGoal: 500 }))
        .toThrow('Campaign is not peer-to-peer type');
    });
  });

  // ═══════════════════════════════════════════════════════
  // TAX RECEIPT GENERATION
  // ═══════════════════════════════════════════════════════
  describe('Tax Receipts', () => {
    test('generates IRS-compliant receipt', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Tax', lastName: 'Donor', email: 'tax@test.com' });
      const donation = engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 500 });
      const receipt = engine.generateTaxReceipt(donation.id, ORG_INFO);
      expect(receipt.receiptNumber).toMatch(/^RCP-\d{4}-\d{5}$/);
      expect(receipt.deductibleAmount).toBe(500);
      expect(receipt.quidProQuoDisclosure).toContain('No goods or services');
    });

    test('generates annual statement', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Ann', lastName: 'Stmt', email: 'ann@test.com' });
      engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 100, date: new Date('2026-03-15') });
      engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 200, date: new Date('2026-06-15') });
      const stmt = engine.generateAnnualStatement(donor.id, 2026, ORG_INFO);
      expect(stmt.totalDeductible).toBe(300);
      expect(stmt.donations).toHaveLength(2);
    });
  });

  // ═══════════════════════════════════════════════════════
  // ENGAGEMENT SCORING
  // ═══════════════════════════════════════════════════════
  describe('Engagement Scoring', () => {
    test('scores recent frequent high-value donor highly', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'High', lastName: 'Score', email: 'high@test.com' });
      for (let i = 0; i < 5; i++) {
        engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 2000, type: 'recurring' });
      }
      const updated = engine.getDonor(donor.id);
      expect(updated?.engagementScore).toBeGreaterThanOrEqual(70);
    });

    test('scores new prospect at zero', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'New', lastName: 'Prospect', email: 'new@test.com' });
      expect(donor.engagementScore).toBe(0);
    });
  });

  // ═══════════════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════════════
  describe('Analytics', () => {
    test('calculates correct org analytics', () => {
      const d1 = engine.createDonor({ organizationId: ORG_ID, firstName: 'A', lastName: 'B', email: 'a@t.com' });
      const d2 = engine.createDonor({ organizationId: ORG_ID, firstName: 'C', lastName: 'D', email: 'c@t.com' });
      engine.recordDonation({ donorId: d1.id, organizationId: ORG_ID, amount: 1000 });
      engine.recordDonation({ donorId: d2.id, organizationId: ORG_ID, amount: 500 });
      const analytics = engine.getAnalytics(ORG_ID);
      expect(analytics.totalDonors).toBe(2);
      expect(analytics.totalRaised).toBe(1500);
      expect(analytics.averageGift).toBe(750);
    });
  });

  // ═══════════════════════════════════════════════════════
  // LAPSED DONOR DETECTION
  // ═══════════════════════════════════════════════════════
  describe('Lapsed Donor Detection', () => {
    test('detects donors with no recent donations', () => {
      const donor = engine.createDonor({ organizationId: ORG_ID, firstName: 'Old', lastName: 'Donor', email: 'old@test.com' });
      const oldDate = new Date(Date.now() - 400 * 86400000);
      engine.recordDonation({ donorId: donor.id, organizationId: ORG_ID, amount: 100, date: oldDate });
      const lapsed = engine.detectLapsedDonors(ORG_ID, 365);
      expect(lapsed).toHaveLength(1);
      expect(lapsed[0].status).toBe('lapsed');
    });
  });

  // ═══════════════════════════════════════════════════════
  // OKLAHOMA STATE TESTS — 3 ORG TYPES
  // ═══════════════════════════════════════════════════════

  describe('Oklahoma — Hindu Temple (Shri Ganesh Mandir)', () => {
    const TEMPLE_ORG = 'ok-temple-001';
    test('tracks festival donation campaign (Diwali)', () => {
      const campaign = engine.createCampaign({ organizationId: TEMPLE_ORG, name: 'Diwali Festival Fund', description: 'Annual Diwali celebration', goalAmount: 15000, startDate: new Date('2026-09-01'), endDate: new Date('2026-11-30'), type: 'event' });
      const donor = engine.createDonor({ organizationId: TEMPLE_ORG, firstName: 'Raj', lastName: 'Patel', email: 'raj@temple.com', type: 'individual' });
      engine.recordDonation({ donorId: donor.id, organizationId: TEMPLE_ORG, amount: 1001, campaignId: campaign.id });
      const receipt = engine.generateTaxReceipt(engine.getDonationsByDonor(donor.id)[0].id, { name: 'Shri Ganesh Mandir', ein: '73-1234567', address: '100 Temple Rd, OKC, OK 73102' });
      expect(receipt.quidProQuoDisclosure).toContain('No goods or services');
      expect(receipt.deductibleAmount).toBe(1001);
    });

    test('manages monthly puja sponsorship (recurring)', () => {
      const donor = engine.createDonor({ organizationId: TEMPLE_ORG, firstName: 'Priya', lastName: 'Sharma', email: 'priya@temple.com' });
      for (let i = 0; i < 12; i++) {
        engine.recordDonation({ donorId: donor.id, organizationId: TEMPLE_ORG, amount: 108, type: 'recurring' });
      }
      const updated = engine.getDonor(donor.id);
      expect(updated?.donationCount).toBe(12);
      expect(updated?.lifetimeValue).toBe(1296);
      expect(updated?.status).toBe('recurring');
      expect(updated?.engagementScore).toBeGreaterThanOrEqual(60);
    });

    test('generates annual donation statement for temple donor', () => {
      const donor = engine.createDonor({ organizationId: TEMPLE_ORG, firstName: 'Amit', lastName: 'Kumar', email: 'amit@temple.com' });
      engine.recordDonation({ donorId: donor.id, organizationId: TEMPLE_ORG, amount: 5000, date: new Date('2026-01-15') });
      engine.recordDonation({ donorId: donor.id, organizationId: TEMPLE_ORG, amount: 2500, date: new Date('2026-07-15') });
      const stmt = engine.generateAnnualStatement(donor.id, 2026, { name: 'Shri Ganesh Mandir', ein: '73-1234567', address: '100 Temple Rd, OKC, OK 73102' });
      expect(stmt.totalDeductible).toBe(7500);
      expect(stmt.donations).toHaveLength(2);
    });
  });

  describe('Oklahoma — Food Bank (Community Food Network)', () => {
    const FOOD_ORG = 'ok-food-001';
    test('runs Thanksgiving corporate matching campaign', () => {
      const campaign = engine.createCampaign({ organizationId: FOOD_ORG, name: 'Thanksgiving Match', description: 'Corporate matching drive', goalAmount: 50000, startDate: new Date('2026-10-01'), endDate: new Date('2026-11-30'), type: 'matching' });
      const corpDonor = engine.createDonor({ organizationId: FOOD_ORG, firstName: 'Devon', lastName: 'Energy', email: 'giving@devon.com', type: 'corporate' });
      engine.recordDonation({ donorId: corpDonor.id, organizationId: FOOD_ORG, amount: 25000, campaignId: campaign.id, type: 'matching' });
      const progress = engine.getCampaignProgress(campaign.id);
      expect(progress.percentage).toBe(50);
      expect(progress.remaining).toBe(25000);
    });

    test('tracks in-kind food donations', () => {
      const donor = engine.createDonor({ organizationId: FOOD_ORG, firstName: 'Local', lastName: 'Grocer', email: 'grocer@test.com', type: 'corporate' });
      const donation = engine.recordDonation({ donorId: donor.id, organizationId: FOOD_ORG, amount: 3500, type: 'in-kind', notes: '2000 lbs canned goods, FMV $3,500' });
      expect(donation.type).toBe('in-kind');
      const receipt = engine.generateTaxReceipt(donation.id, { name: 'Community Food Network', ein: '73-9876543', address: '200 Harvest Blvd, Tulsa, OK 74101' });
      expect(receipt.deductibleAmount).toBe(3500);
    });

    test('detects lapsed food drive donors', () => {
      const donor = engine.createDonor({ organizationId: FOOD_ORG, firstName: 'Former', lastName: 'Donor', email: 'former@test.com' });
      engine.recordDonation({ donorId: donor.id, organizationId: FOOD_ORG, amount: 200, date: new Date('2025-01-15') });
      const lapsed = engine.detectLapsedDonors(FOOD_ORG, 365);
      expect(lapsed.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Oklahoma — IT Nonprofit (TechBridge OKC)', () => {
    const IT_ORG = 'ok-it-001';
    test('manages peer-to-peer coding bootcamp fundraiser', () => {
      const campaign = engine.createCampaign({ organizationId: IT_ORG, name: 'Code for Good 2026', description: 'P2P bootcamp fundraiser', goalAmount: 30000, startDate: new Date('2026-04-01'), endDate: new Date('2026-06-30'), type: 'peer-to-peer' });
      const fundraiser = engine.addPeerFundraiser(campaign.id, { fundraiserName: 'Mike Chen', fundraiserEmail: 'mike@techbridge.org', personalGoal: 5000 });
      expect(fundraiser.pageUrl).toContain('/fundraise/');
      expect(fundraiser.personalGoal).toBe(5000);
    });

    test('tracks grant from Oklahoma tech fund', () => {
      const grantDonor = engine.createDonor({ organizationId: IT_ORG, firstName: 'Oklahoma', lastName: 'Innovation Fund', email: 'grants@okfund.gov', type: 'government' });
      const donation = engine.recordDonation({ donorId: grantDonor.id, organizationId: IT_ORG, amount: 75000, designation: 'restricted', notes: 'STEM education grant - Year 1 of 3' });
      expect(donation.designation).toBe('restricted');
      expect(engine.getDonor(grantDonor.id)?.lifetimeValue).toBe(75000);
    });

    test('generates analytics for IT nonprofit', () => {
      const d1 = engine.createDonor({ organizationId: IT_ORG, firstName: 'Tech', lastName: 'Corp', email: 'tech@corp.com', type: 'corporate' });
      const d2 = engine.createDonor({ organizationId: IT_ORG, firstName: 'Individual', lastName: 'Giver', email: 'ind@test.com' });
      engine.recordDonation({ donorId: d1.id, organizationId: IT_ORG, amount: 10000 });
      engine.recordDonation({ donorId: d2.id, organizationId: IT_ORG, amount: 250 });
      const analytics = engine.getAnalytics(IT_ORG);
      expect(analytics.totalDonors).toBe(2);
      expect(analytics.totalRaised).toBe(10250);
      expect(analytics.donorsByType['corporate']).toBe(1);
      expect(analytics.donorsByType['individual']).toBe(1);
    });
  });
});
