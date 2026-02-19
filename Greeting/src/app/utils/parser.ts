// SMS and Email parsing utility for TrialGuard

export interface ParsedSubscriptionData {
  serviceName?: string;
  amount?: number;
  currency?: string;
  billingDate?: string;
  isTrial?: boolean;
}

// Common service keywords
const serviceKeywords = [
  'Netflix', 'Spotify', 'Apple Music', 'YouTube Premium', 'Disney+', 
  'Amazon Prime', 'HBO', 'Shopee', 'Lazada', 'LINE', 'JOOX',
  'Viu', 'iQIYI', 'AIS', 'True', 'DTAC'
];

// Thai month names
const thaiMonths: { [key: string]: number } = {
  'ม.ค.': 1, 'มกราคม': 1,
  'ก.พ.': 2, 'กุมภาพันธ์': 2,
  'มี.ค.': 3, 'มีนาคม': 3,
  'เม.ย.': 4, 'เมษายน': 4,
  'พ.ค.': 5, 'พฤษภาคม': 5,
  'มิ.ย.': 6, 'มิถุนายน': 6,
  'ก.ค.': 7, 'กรกฎาคม': 7,
  'ส.ค.': 8, 'สิงหาคม': 8,
  'ก.ย.': 9, 'กันยายน': 9,
  'ต.ค.': 10, 'ตุลาคม': 10,
  'พ.ย.': 11, 'พฤศจิกายน': 11,
  'ธ.ค.': 12, 'ธันวาคม': 12,
};

export function parseEmailOrSMS(text: string): ParsedSubscriptionData {
  const result: ParsedSubscriptionData = {};

  // 1. Extract service name
  result.serviceName = extractServiceName(text);

  // 2. Extract amount
  const amountData = extractAmount(text);
  result.amount = amountData.amount;
  result.currency = amountData.currency;

  // 3. Extract billing date
  result.billingDate = extractDate(text);

  // 4. Check if it's a trial
  result.isTrial = checkIfTrial(text);

  return result;
}

function extractServiceName(text: string): string | undefined {
  // Look for known service keywords
  for (const service of serviceKeywords) {
    if (text.toLowerCase().includes(service.toLowerCase())) {
      return service;
    }
  }

  // Try to extract from common patterns
  const patterns = [
    /subscription to ([A-Za-z0-9\s]+)/i,
    /บริการ ([A-Za-zก-๙0-9\s]+)/i,
    /from ([A-Za-z0-9\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return undefined;
}

function extractAmount(text: string): { amount?: number; currency?: string } {
  // Pattern for THB: 299 THB, THB 299, ฿299, 299 บาท
  const thbPatterns = [
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:THB|บาท|฿)/i,
    /(?:THB|฿)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];

  for (const pattern of thbPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      return { amount, currency: 'THB' };
    }
  }

  // Pattern for USD: $9.99, USD 9.99
  const usdPatterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    /USD\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
  ];

  for (const pattern of usdPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      return { amount, currency: 'USD' };
    }
  }

  // Generic number pattern as fallback
  const genericPattern = /(\d+(?:,\d{3})*(?:\.\d{2})?)/;
  const match = text.match(genericPattern);
  if (match && match[1]) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    return { amount, currency: 'THB' }; // Default to THB
  }

  return {};
}

function extractDate(text: string): string | undefined {
  // ISO format: 2026-02-28
  const isoMatch = text.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) {
    return isoMatch[0];
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Thai date format: 28 ก.พ. 2569 or 28 กุมภาพันธ์ 2569
  const thaiDatePattern = /(\d{1,2})\s+([ก-๙\.]+)\s+(\d{4})/;
  const thaiMatch = text.match(thaiDatePattern);
  if (thaiMatch) {
    const day = thaiMatch[1].padStart(2, '0');
    const monthName = thaiMatch[2];
    let year = parseInt(thaiMatch[3]);
    
    // Convert Buddhist year to Gregorian if needed
    if (year > 2500) {
      year -= 543;
    }
    
    const month = thaiMonths[monthName];
    if (month) {
      return `${year}-${month.toString().padStart(2, '0')}-${day}`;
    }
  }

  // English month format: Feb 28, 2026 or February 28, 2026
  const engMonthPattern = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i;
  const engMatch = text.match(engMonthPattern);
  if (engMatch) {
    const monthMap: { [key: string]: string } = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    };
    const month = monthMap[engMatch[1].toLowerCase().substring(0, 3)];
    const day = engMatch[2].padStart(2, '0');
    const year = engMatch[3];
    return `${year}-${month}-${day}`;
  }

  return undefined;
}

function checkIfTrial(text: string): boolean {
  const trialKeywords = [
    'trial', 'ทดลอง', 'free trial', 'trial period',
    'ทดลองใช้ฟรี', 'ฟรี'
  ];

  const lowerText = text.toLowerCase();
  return trialKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

// Sample text examples for testing
export const sampleTexts = {
  netflix: `Netflix Subscription
Your payment of THB 299 has been processed.
Next billing date: 2026-03-15
Thank you for being a member!`,

  spotify: `Spotify Premium
Amount: ฿129
Your subscription will renew on 28/02/2026
Enjoy ad-free music!`,

  trial: `Welcome to Disney+!
Your 7-day free trial has started.
After the trial, you will be charged $9.99/month
Trial ends: Feb 25, 2026`,

  thai: `ยินดีต้อนรับสู่ AIS PLAY
ค่าบริการรายเดือน: 149 บาท
วันต่ออายุครั้งถัดไป: 20 มี.ค. 2569
ขอบคุณที่ใช้บริการ`,
};
