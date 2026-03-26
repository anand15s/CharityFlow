// src/lib/expenses/receipt-scanner.ts
// SmartScan Receipt OCR Engine — Production Implementation

import {
  ReceiptScanResult,
  LineItem,
  ExpenseCategory,
} from './types';

// Merchant-to-category mapping database
const MERCHANT_CATEGORY_MAP: Record<string, ExpenseCategory> = {
  'staples': 'office_supplies',
  'office depot': 'office_supplies',
  'amazon': 'office_supplies',
  'walmart': 'program_supplies',
  'target': 'program_supplies',
  'costco': 'program_supplies',
  'home depot': 'program_supplies',
  'lowes': 'program_supplies',
  'uber': 'travel',
  'lyft': 'travel',
  'delta': 'travel',
  'united': 'travel',
  'southwest': 'travel',
  'marriott': 'travel',
  'hilton': 'travel',
  'holiday inn': 'travel',
  'shell': 'vehicle',
  'chevron': 'vehicle',
  'exxon': 'vehicle',
  'bp': 'vehicle',
  'comcast': 'utilities',
  'at&t': 'utilities',
  'verizon': 'utilities',
  'duke energy': 'utilities',
  'usps': 'postage',
  'fedex': 'postage',
  'ups': 'postage',
  'google': 'technology',
  'microsoft': 'technology',
  'adobe': 'technology',
  'zoom': 'technology',
  'slack': 'technology',
  'mailchimp': 'marketing',
  'canva': 'marketing',
  'vistaprint': 'printing',
  'eventbrite': 'event_costs',
  'catering': 'event_costs',
};

// Common date formats found on receipts
const DATE_PATTERNS: { regex: RegExp; format: string }[] = [
  { regex: /(\d{1,2})\/(\d{1,2})\/(\d{4})/, format: 'MM/DD/YYYY' },
  { regex: /(\d{1,2})\/(\d{1,2})\/(\d{2})/, format: 'MM/DD/YY' },
  { regex: /(\d{4})-(\d{2})-(\d{2})/, format: 'YYYY-MM-DD' },
  { regex: /(\w{3})\s+(\d{1,2}),?\s+(\d{4})/, format: 'Mon DD, YYYY' },
  { regex: /(\d{1,2})-(\d{1,2})-(\d{4})/, format: 'MM-DD-YYYY' },
];

// Amount extraction patterns
const AMOUNT_PATTERNS: RegExp[] = [
  /(?:total|amount|due|balance|grand total|subtotal)[:\s]*\$?([\d,]+\.\d{2})/i,
  /\$([\d,]+\.\d{2})/g,
  /([\d,]+\.\d{2})\s*(?:usd|USD)/g,
];

// Tax extraction patterns
const TAX_PATTERNS: RegExp[] = [
  /(?:tax|sales tax|vat|gst|hst)[:\s]*\$?([\d,]+\.\d{2})/i,
  /(?:tax)[:\s]*([\d.]+)%/i,
];

// Payment method patterns
const PAYMENT_PATTERNS: Record<string, RegExp> = {
  'visa': /visa/i,
  'mastercard': /mastercard|mc/i,
  'amex': /amex|american express/i,
  'discover': /discover/i,
  'debit': /debit/i,
  'cash': /cash/i,
  'check': /check|cheque/i,
  'ach': /ach|bank transfer/i,
};

/**
 * ReceiptScanner — Core OCR processing engine
 * 
 * In production, this integrates with Google Cloud Vision, AWS Textract,
 * or Tesseract.js for actual OCR. The engine handles:
 * 1. Text extraction from receipt images
 * 2. Structured data parsing (merchant, amount, date, items)
 * 3. Auto-categorization based on merchant rules
 * 4. Confidence scoring
 * 5. Validation and error correction
 */
export class ReceiptScanner {
  private customMerchantRules: Map<string, ExpenseCategory> = new Map();
  private ocrProvider: 'google_vision' | 'aws_textract' | 'tesseract' | 'mock';

  constructor(ocrProvider: 'google_vision' | 'aws_textract' | 'tesseract' | 'mock' = 'mock') {
    this.ocrProvider = ocrProvider;
  }

  /**
   * Add custom merchant-to-category rules (org-specific)
   */
  addMerchantRule(merchantPattern: string, category: ExpenseCategory): void {
    this.customMerchantRules.set(merchantPattern.toLowerCase(), category);
  }

  /**
   * Remove a custom merchant rule
   */
  removeMerchantRule(merchantPattern: string): boolean {
    return this.customMerchantRules.delete(merchantPattern.toLowerCase());
  }

  /**
   * Main scan method — processes receipt image/text and returns structured data
   */
  async scanReceipt(input: { imageUrl?: string; rawText?: string }): Promise<ReceiptScanResult> {
    let rawText = input.rawText || '';

    // Step 1: OCR — extract text from image
    if (input.imageUrl && !rawText) {
      rawText = await this.performOCR(input.imageUrl);
    }

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('SCAN_FAILED: No text could be extracted from the receipt');
    }

    // Step 2: Extract structured fields
    const merchant = this.extractMerchant(rawText);
    const amount = this.extractAmount(rawText);
    const date = this.extractDate(rawText);
    const taxAmount = this.extractTax(rawText);
    const paymentMethod = this.extractPaymentMethod(rawText);
    const lineItems = this.extractLineItems(rawText);
    const category = this.categorizeByMerchant(merchant);

    // Step 3: Calculate confidence score
    const confidence = this.calculateConfidence({
      merchant,
      amount,
      date,
      lineItems,
      rawText,
    });

    // Step 4: Validate and correct
    const correctedAmount = this.validateAmount(amount, lineItems, taxAmount);

    return {
      merchant,
      amount: correctedAmount,
      currency: 'USD',
      date: date || new Date().toISOString().split('T')[0],
      category,
      taxAmount,
      paymentMethod,
      lineItems,
      confidence,
      rawText,
      imageUrl: input.imageUrl || '',
    };
  }

  /**
   * Perform OCR on an image URL
   * In production, this calls Google Vision API, AWS Textract, or Tesseract.js
   */
  private async performOCR(imageUrl: string): Promise<string> {
    switch (this.ocrProvider) {
      case 'google_vision':
        return this.callGoogleVision(imageUrl);
      case 'aws_textract':
        return this.callAWSTextract(imageUrl);
      case 'tesseract':
        return this.callTesseract(imageUrl);
      case 'mock':
      default:
        return this.mockOCR(imageUrl);
    }
  }

  /**
   * Google Cloud Vision API integration
   */
  private async callGoogleVision(imageUrl: string): Promise<string> {
    const apiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_VISION_API_KEY not configured');

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          }],
        }),
      }
    );

    const data = await response.json();
    return data.responses?.[0]?.fullTextAnnotation?.text || '';
  }

  /**
   * AWS Textract integration
   */
  private async callAWSTextract(imageUrl: string): Promise<string> {
    // In production: uses @aws-sdk/client-textract
    throw new Error('AWS Textract requires @aws-sdk/client-textract — configure in production');
  }

  /**
   * Tesseract.js (local/browser-based OCR)
   */
  private async callTesseract(imageUrl: string): Promise<string> {
    // In production: uses tesseract.js
    throw new Error('Tesseract.js requires tesseract.js package — configure in production');
  }

  /**
   * Mock OCR for testing
   */
  private async mockOCR(imageUrl: string): Promise<string> {
    return `RECEIPT\nSTAPLES #1234\n123 Main St, Austin TX 78701\n03/15/2026\n\nPaper Ream (5pk)    $24.99\nInk Cartridge       $34.99\nPens (12pk)         $8.99\n\nSubtotal: $68.97\nTax: $5.69\nTotal: $74.66\n\nVISA ****1234`;
  }

  /**
   * Extract merchant name from receipt text
   */
  extractMerchant(text: string): string {
    const lines = text.split('\n').filter(l => l.trim().length > 0);

    // First non-empty line is usually the merchant name
    // Skip common headers like "RECEIPT", "SALES RECEIPT", etc.
    const skipPatterns = /^(receipt|sales receipt|transaction|invoice|order|thank you)/i;

    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned.length > 1 && !skipPatterns.test(cleaned)) {
        // Remove store numbers like "#1234"
        return cleaned.replace(/#\d+/g, '').trim();
      }
    }

    return 'Unknown Merchant';
  }

  /**
   * Extract total amount from receipt text
   */
  extractAmount(text: string): number {
    // Try explicit total patterns first
    for (const pattern of AMOUNT_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const amountStr = match[1] || match[0].replace(/[^\d.]/g, '');
        const amount = parseFloat(amountStr.replace(/,/g, ''));
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }

    // Fallback: find the largest dollar amount (likely the total)
    const allAmounts: number[] = [];
    const dollarRegex = /\$([\d,]+\.\d{2})/g;
    let match;
    while ((match = dollarRegex.exec(text)) !== null) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount)) allAmounts.push(amount);
    }

    if (allAmounts.length > 0) {
      return Math.max(...allAmounts);
    }

    return 0;
  }

  /**
   * Extract date from receipt text
   */
  extractDate(text: string): string | null {
    for (const { regex, format } of DATE_PATTERNS) {
      const match = text.match(regex);
      if (match) {
        try {
          return this.normalizeDate(match[0], format);
        } catch {
          continue;
        }
      }
    }
    return null;
  }

  /**
   * Normalize date to ISO format
   */
  private normalizeDate(dateStr: string, format: string): string {
    const months: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    };

    if (format === 'YYYY-MM-DD') {
      return dateStr;
    }

    if (format === 'Mon DD, YYYY') {
      const parts = dateStr.match(/(\w{3})\s+(\d{1,2}),?\s+(\d{4})/);
      if (parts) {
        const month = months[parts[1].toLowerCase()] || '01';
        const day = parts[2].padStart(2, '0');
        return `${parts[3]}-${month}-${day}`;
      }
    }

    if (format === 'MM/DD/YYYY' || format === 'MM-DD-YYYY') {
      const sep = format.includes('/') ? '/' : '-';
      const parts = dateStr.split(sep);
      if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        return `${parts[2]}-${month}-${day}`;
      }
    }

    if (format === 'MM/DD/YY') {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const year = parseInt(parts[2]) > 50 ? `19${parts[2]}` : `20${parts[2]}`;
        return `${year}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      }
    }

    return dateStr;
  }

  /**
   * Extract tax amount from receipt
   */
  extractTax(text: string): number | null {
    for (const pattern of TAX_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }
    return null;
  }

  /**
   * Extract payment method from receipt
   */
  extractPaymentMethod(text: string): string | null {
    for (const [method, pattern] of Object.entries(PAYMENT_PATTERNS)) {
      if (pattern.test(text)) {
        return method;
      }
    }
    return null;
  }

  /**
   * Extract line items from receipt text
   */
  extractLineItems(text: string): LineItem[] {
    const items: LineItem[] = [];
    const lines = text.split('\n');

    // Pattern: description followed by price
    const itemPattern = /^(.+?)\s+\$?([\d,]+\.\d{2})\s*$/;
    // Pattern: quantity x price
    const qtyPattern = /^(.+?)\s+(\d+)\s*[x×@]\s*\$?([\d,]+\.\d{2})\s+\$?([\d,]+\.\d{2})\s*$/i;

    const skipWords = /^(subtotal|total|tax|sales tax|balance|due|change|cash|visa|mastercard|amex|debit|credit|tip|gratuity)/i;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || skipWords.test(trimmed)) continue;

      // Try quantity pattern first
      const qtyMatch = trimmed.match(qtyPattern);
      if (qtyMatch) {
        items.push({
          description: qtyMatch[1].trim(),
          quantity: parseInt(qtyMatch[2]),
          unitPrice: parseFloat(qtyMatch[3].replace(/,/g, '')),
          totalPrice: parseFloat(qtyMatch[4].replace(/,/g, '')),
          category: null,
        });
        continue;
      }

      // Try simple item pattern
      const itemMatch = trimmed.match(itemPattern);
      if (itemMatch && !skipWords.test(itemMatch[1])) {
        const price = parseFloat(itemMatch[2].replace(/,/g, ''));
        if (price > 0 && price < 10000) { // sanity check
          items.push({
            description: itemMatch[1].trim(),
            quantity: 1,
            unitPrice: price,
            totalPrice: price,
            category: null,
          });
        }
      }
    }

    return items;
  }

  /**
   * Categorize expense by merchant name
   */
  categorizeByMerchant(merchant: string): ExpenseCategory | null {
    const lowerMerchant = merchant.toLowerCase();

    // Check custom rules first (org-specific)
    for (const [pattern, category] of this.customMerchantRules) {
      if (lowerMerchant.includes(pattern)) {
        return category;
      }
    }

    // Check default merchant map
    for (const [pattern, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
      if (lowerMerchant.includes(pattern)) {
        return category;
      }
    }

    return null;
  }

  /**
   * Calculate confidence score (0-1) for the scan result
   */
  calculateConfidence(data: {
    merchant: string;
    amount: number;
    date: string | null;
    lineItems: LineItem[];
    rawText: string;
  }): number {
    let score = 0;
    let maxScore = 0;

    // Merchant extracted? (20% weight)
    maxScore += 20;
    if (data.merchant && data.merchant !== 'Unknown Merchant') score += 20;

    // Amount extracted? (30% weight)
    maxScore += 30;
    if (data.amount > 0) score += 30;

    // Date extracted? (20% weight)
    maxScore += 20;
    if (data.date) score += 20;

    // Line items found? (20% weight)
    maxScore += 20;
    if (data.lineItems.length > 0) score += 20;

    // Text quality (10% weight)
    maxScore += 10;
    if (data.rawText.length > 50) score += 5;
    if (data.rawText.length > 200) score += 5;

    return Math.round((score / maxScore) * 100) / 100;
  }

  /**
   * Validate amount against line items
   */
  validateAmount(amount: number, lineItems: LineItem[], tax: number | null): number {
    if (lineItems.length === 0) return amount;

    const lineTotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const expectedTotal = lineTotal + (tax || 0);

    // If extracted total matches line items + tax, high confidence
    if (Math.abs(amount - expectedTotal) < 0.02) {
      return amount;
    }

    // If total is close to line items sum (without tax), use it
    if (Math.abs(amount - lineTotal) < 0.02) {
      return amount;
    }

    // If amount seems wrong but line items are clear, prefer line items
    if (amount === 0 && lineTotal > 0) {
      return expectedTotal;
    }

    return amount;
  }
}

export default ReceiptScanner;
