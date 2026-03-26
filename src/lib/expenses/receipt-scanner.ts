// CharityFlow Receipt Scanner v4.0
// OCR-powered receipt scanning with auto-categorization

export interface ScannedReceipt {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  category: string;
  confidence: number;
  rawText: string;
  ocrProvider: 'google_vision' | 'textract' | 'tesseract';
}

export interface ScanResult {
  success: boolean;
  receipt?: ScannedReceipt;
  error?: string;
}

const MERCHANT_RULES: Array<{ patterns: string[]; category: string }> = [
  { patterns: ['walmart', 'target', 'costco', 'sam\'s club'], category: 'Program Supplies' },
  { patterns: ['office depot', 'staples', 'best buy'], category: 'Office Expenses' },
  { patterns: ['shell', 'chevron', 'exxon', 'bp', 'gas'], category: 'Travel' },
  { patterns: ['hilton', 'marriott', 'holiday inn', 'airbnb'], category: 'Travel' },
  { patterns: ['usps', 'fedex', 'ups', 'dhl'], category: 'Postage & Shipping' },
  { patterns: ['at&t', 'verizon', 'comcast', 'spectrum'], category: 'Utilities' },
  { patterns: ['pge', 'duke energy', 'con edison', 'electric'], category: 'Utilities' },
  { patterns: ['sysco', 'us foods', 'gordon food'], category: 'Program Supplies' },
  { patterns: ['home depot', 'lowes', 'ace hardware'], category: 'Maintenance' },
  { patterns: ['google', 'microsoft', 'adobe', 'zoom'], category: 'Software & Technology' },
];

export class ReceiptScanner {
  extractMerchant(rawText: string): string {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    return lines[0] || 'Unknown Merchant';
  }

  extractAmount(rawText: string): number {
    const patterns = [
      /total[:\s]*\$?([\d,]+\.\d{2})/i,
      /amount[:\s]*\$?([\d,]+\.\d{2})/i,
      /\$([\d,]+\.\d{2})/,
    ];
    for (const pattern of patterns) {
      const match = rawText.match(pattern);
      if (match) return parseFloat(match[1].replace(',', ''));
    }
    return 0;
  }

  extractDate(rawText: string): string {
    const patterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/,
      /(\d{4})-(\d{2})-(\d{2})/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/i,
    ];
    for (const pattern of patterns) {
      const match = rawText.match(pattern);
      if (match) return match[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  categorizeByMerchant(merchantName: string): string {
    const lower = merchantName.toLowerCase();
    for (const rule of MERCHANT_RULES) {
      if (rule.patterns.some(p => lower.includes(p))) return rule.category;
    }
    return 'General';
  }

  calculateConfidence(receipt: Partial<ScannedReceipt>): number {
    let score = 0;
    if (receipt.merchantName && receipt.merchantName !== 'Unknown Merchant') score += 30;
    if (receipt.amount && receipt.amount > 0) score += 35;
    if (receipt.date) score += 20;
    if (receipt.category && receipt.category !== 'General') score += 15;
    return Math.min(score, 100);
  }

  scan(rawText: string, provider: 'google_vision' | 'textract' | 'tesseract' = 'google_vision'): ScanResult {
    if (!rawText || rawText.trim() === '') {
      return { success: false, error: 'Empty receipt text' };
    }

    const merchantName = this.extractMerchant(rawText);
    const amount = this.extractAmount(rawText);
    const date = this.extractDate(rawText);
    const category = this.categorizeByMerchant(merchantName);

    const receipt: ScannedReceipt = {
      id: `rcpt_${Date.now()}`,
      merchantName,
      amount,
      date,
      category,
      confidence: 0,
      rawText,
      ocrProvider: provider,
    };

    receipt.confidence = this.calculateConfidence(receipt);

    return { success: true, receipt };
  }
}

export default ReceiptScanner;
