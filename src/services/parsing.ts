/**
 * Text Parsing Service
 * Rule-based logic and regex for parsing subscription data from emails/SMS
 */

import { ParsedSubscriptionData, BillingCycle } from '@models/Subscription';

interface ParseRule {
  name: RegExp[];
  cost: RegExp[];
  billingCycle: RegExp[];
  date: RegExp[];
}

// Common parsing rules for popular services
const PARSING_RULES: Record<string, ParseRule> = {
  netflix: {
    name: [/netflix/i],
    cost: [/(\d+(?:\.\d{2})?)\s*(?:thb|฿|baht)/i, /฿(\d+)/i, /(\d+)\s*baht/i],
    billingCycle: [/(monthly|month|mo)/i, /(yearly|year|annual)/i, /(weekly|week)/i],
    date: [/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/],
  },
  spotify: {
    name: [/spotify/i],
    cost: [/(\d+(?:\.\d{2})?)\s*(?:thb|฿|baht)/i, /฿(\d+)/i],
    billingCycle: [/(monthly|month|mo)/i, /(yearly|year|annual)/i],
    date: [/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/],
  },
  amazon: {
    name: [/amazon\s*prime/i, /prime\s*video/i],
    cost: [/(\d+(?:\.\d{2})?)\s*(?:thb|฿|baht)/i],
    billingCycle: [/(monthly|month)/i, /(yearly|year|annual)/i],
    date: [/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/],
  },
};

/**
 * Parse "will be in N month" (e.g. "Next billing will be in 4 march") → Date.
 * Runs first so next billing date is always set when this phrase appears.
 */
const parseWillBeInMonth = (text: string): Date | undefined => {
  const normalized = text.replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim();
  const match = normalized.match(/will\s+be\s+in\s+(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/i);
  if (!match || !match[1] || !match[2]) return undefined;
  const day = parseInt(match[1], 10);
  const monthMap: Record<string, number> = {
    january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
    may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
    september: 8, sep: 8, october: 9, oct: 9, november: 10, nov: 10,
    december: 11, dec: 11,
  };
  const month = monthMap[match[2].toLowerCase()];
  if (month === undefined || day < 1 || day > 31) return undefined;
  return new Date(new Date().getFullYear(), month, day);
};

/**
 * Parse subscription data from text (email/SMS content)
 */
export const parseSubscriptionText = (text: string): ParsedSubscriptionData => {
  const result: ParsedSubscriptionData = {};

  // Set next billing date first if text contains "will be in N month" (e.g. "4 march")
  const nextBillingFromPhrase = parseWillBeInMonth(text);
  if (nextBillingFromPhrase) {
    result.nextBillingDate = nextBillingFromPhrase;
  }

  // Clean and normalize text
  const cleanText = text.toLowerCase().trim();

  // Try to match against known services
  for (const [serviceName, rules] of Object.entries(PARSING_RULES)) {
    const nameMatch = rules.name.some(regex => regex.test(cleanText));
    
    if (nameMatch) {
      result.name = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
      
      // Extract cost
      for (const costRegex of rules.cost) {
        const costMatch = cleanText.match(costRegex);
        if (costMatch && costMatch[1]) {
          result.cost = parseFloat(costMatch[1]);
          result.currency = '฿'; // Default to THB
          break;
        }
      }
      
      // Extract billing cycle
      for (const cycleRegex of rules.billingCycle) {
        const cycleMatch = cleanText.match(cycleRegex);
        if (cycleMatch && cycleMatch[1]) {
          const cycle = cycleMatch[1].toLowerCase();
          if (cycle.includes('month')) {
            result.billingCycle = 'monthly';
          } else if (cycle.includes('year') || cycle.includes('annual')) {
            result.billingCycle = 'yearly';
          } else if (cycle.includes('week')) {
            result.billingCycle = 'weekly';
          }
          break;
        }
      }
      
      // Extract dates (start, end, next billing)
      extractAllDates(text, result);
      break; // Found a match, stop looking
    }
  }

  // Generic fallback parsing if no specific service matched
  if (!result.name) {
    result.name = extractGenericServiceName(text);
    result.cost = extractGenericCost(text);
    result.currency = '฿';
    result.billingCycle = extractGenericBillingCycle(text);
    extractAllDates(text, result);
    if (!result.nextBillingDate && !result.trialEndDate) {
      result.nextBillingDate = extractGenericDate(text);
    }
  }

  return result;
};

/**
 * Extract end date (trialEndDate) and next billing date from text using context.
 * Trial end date = end date per model.
 */
const extractAllDates = (text: string, result: ParsedSubscriptionData): void => {
  // Normalize once: collapse all whitespace so "Next billing\nwill be in 2 march" matches
  const normalizedText = text.replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim();

  // First: bulletproof "will be in 2 march" / "will be in 3 March" (next billing)
  const willBeInMatch = normalizedText.match(/will\s+be\s+in\s+(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/i);
  if (willBeInMatch && willBeInMatch[1] && willBeInMatch[2]) {
    const day = parseInt(willBeInMatch[1], 10);
    const monthName = willBeInMatch[2].toLowerCase();
    const monthIndex: Record<string, number> = {
      january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
      may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
      september: 8, sep: 8, october: 9, oct: 9, november: 10, nov: 10,
      december: 11, dec: 11,
    };
    const month = monthIndex[monthName];
    if (month !== undefined && day >= 1 && day <= 31) {
      const year = new Date().getFullYear();
      result.nextBillingDate = new Date(year, month, day);
    }
  }

  // End date / trial end / expires patterns → trialEndDate (end date)
  const endPatterns: Array<{ pattern: RegExp; useMonthNameParser?: boolean }> = [
    { pattern: /(?:trial\s*)?end(?:s)?\s*(?:on|date)?\s*(?:in\s*)?[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
    { pattern: /(?:trial\s*)?end(?:s)?\s*(?:on|date)?\s*(?:in\s*)?[:\s]*(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)/i, useMonthNameParser: true },
    { pattern: /expire(?:s)?\s*(?:on)?\s*[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
    { pattern: /expire(?:s)?\s*(?:on)?\s*(?:in\s*)?[:\s]*(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)/i, useMonthNameParser: true },
    { pattern: /valid\s*until\s*[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
    { pattern: /valid\s*until\s*[:\s]*(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)/i, useMonthNameParser: true },
    { pattern: /(?:until|through)\s+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
    { pattern: /(?:until|through)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)/i, useMonthNameParser: true },
    { pattern: /renew(?:s|al)?\s*(?:on)?\s*[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
  ];

  // Next billing / charge date patterns (numeric and "2 March" / "March 2" style)
  const monthNameGroup = '(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)';
  const dayMonthCapture = `(\\d{1,2}(?:st|nd|rd|th)?\\s*${monthNameGroup}(?:\\s+\\d{4})?)`;
  const nextBillingPatterns: Array<{ pattern: RegExp; useMonthNameParser?: boolean }> = [
    { pattern: /next\s*(?:billing|charge|payment)\s*(?:date)?\s*(?:will be\s*)?(?:on\s*)?(?:in\s*)?[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
    { pattern: /(?:billing|payment)\s+will be\s+in\s+(\d{1,2}\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)/i, useMonthNameParser: true },
    { pattern: new RegExp(`next\\s*(?:billing|charge|payment)\\s*(?:date)?\\s*(?:will be\\s*)?(?:on\\s*)?(?:in\\s*)?[:\\s]*${dayMonthCapture}`, 'i'), useMonthNameParser: true },
    { pattern: new RegExp(`(?:billing|charge)\\s*(?:date)?\\s*(?:on|in)?\\s*[:\\s]*${dayMonthCapture}`, 'i'), useMonthNameParser: true },
    { pattern: new RegExp(`(\\d{1,2}(?:st|nd|rd|th)?\\s*${monthNameGroup}(?:\\s+\\d{4})?)\\s*(?:\\.|,|\\s|$)`, 'i'), useMonthNameParser: true },
    { pattern: new RegExp(`(${monthNameGroup}\\s+\\d{1,2}(?:st|nd|rd|th)?)(?:\\s+\\d{4})?\\s*(?:\\s|,|\\.|$)`, 'i'), useMonthNameParser: true },
    { pattern: /billing\s*(?:date)?\s*[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
    { pattern: /charged\s*(?:on)?\s*[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i },
  ];

  for (const { pattern, useMonthNameParser } of endPatterns) {
    const match = normalizedText.match(pattern);
    if (match && match[1]) {
      const dateStr = match[1].replace(/\s+/g, ' ').trim();
      const d = useMonthNameParser ? parseDateWithMonthName(dateStr) : (parseDate(dateStr) ?? parseDateWithMonthName(dateStr));
      if (d) {
        result.trialEndDate = d;
        break;
      }
    }
  }

  if (!result.nextBillingDate) {
    for (const { pattern, useMonthNameParser } of nextBillingPatterns) {
      const match = normalizedText.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1].replace(/\s+/g, ' ').trim();
        const d = useMonthNameParser ? parseDateWithMonthName(dateStr) : (parseDate(dateStr) ?? parseDateWithMonthName(dateStr));
        if (d) {
          result.nextBillingDate = d;
          break;
        }
      }
    }
  }

  // Fallback: first date as next billing, second as end date (trialEndDate) if we have no context
  const allDates: Array<{ index: number; date: Date }> = [];
  let m;
  const re = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g;
  while ((m = re.exec(normalizedText)) !== null) {
    const dateStr = m[1] || m[2];
    if (dateStr) {
      const d = parseDate(dateStr);
      if (d) allDates.push({ index: m.index, date: d });
    }
  }
  if (allDates.length >= 1 && !result.nextBillingDate) result.nextBillingDate = allDates[0].date;
  if (allDates.length >= 2 && !result.trialEndDate) result.trialEndDate = allDates[1].date;

  // Fallback: look for "N monthname" or "monthname N" anywhere (e.g. "2 march", "march 2")
  if (!result.nextBillingDate) {
    const dayMonth = normalizedText.match(/\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)\b/i);
    if (dayMonth && dayMonth[1]) {
      const d = parseDateWithMonthName(dayMonth[1].replace(/\s+/g, ' ').trim());
      if (d) result.nextBillingDate = d;
    } else {
      const monthDay = normalizedText.match(/\b((?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?)(?:\s+\d{4})?\b/i);
      if (monthDay && monthDay[1]) {
        const d = parseDateWithMonthName(monthDay[1].replace(/\s+/g, ' ').trim());
        if (d) result.nextBillingDate = d;
      }
    }
  }
};

/**
 * Extract service name using generic patterns
 */
const extractGenericServiceName = (text: string): string | undefined => {
  // Look for common patterns like "Thank you for subscribing to [Service]"
  const patterns = [
    /thank you for subscribing to\s+([a-z\s]+)/i,
    /welcome to\s+([a-z\s]+)/i,
    /your\s+([a-z\s]+)\s+subscription/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return undefined;
};

/**
 * Extract cost using generic patterns
 */
const extractGenericCost = (text: string): number | undefined => {
  const costPatterns = [
    /(\d+(?:\.\d{2})?)\s*(?:thb|฿|baht)/i,
    /฿(\d+(?:\.\d{2})?)/i,
    /(\d+(?:\.\d{2})?)\s*baht/i,
    /cost[:\s]+(\d+(?:\.\d{2})?)/i,
    /price[:\s]+(\d+(?:\.\d{2})?)/i,
  ];
  
  for (const pattern of costPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
  }
  
  return undefined;
};

/**
 * Extract billing cycle using generic patterns
 */
const extractGenericBillingCycle = (text: string): BillingCycle | undefined => {
  if (/(monthly|month|mo\.)/i.test(text)) {
    return 'monthly';
  } else if (/(yearly|year|annual)/i.test(text)) {
    return 'yearly';
  } else if (/(weekly|week)/i.test(text)) {
    return 'weekly';
  } else if (/(daily|day)/i.test(text)) {
    return 'daily';
  }
  
  return undefined;
};

/**
 * Extract date using generic patterns
 */
const extractGenericDate = (text: string): Date | undefined => {
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /(next billing date[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseDate(match[1]);
    }
  }
  
  return undefined;
};

/**
 * Parse date string that contains month names: "2 March", "March 2", "2 March 2026"
 */
const parseDateWithMonthName = (dateStr: string): Date | undefined => {
  const months: Record<string, number> = {
    january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
    may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
    september: 8, sep: 8, october: 9, oct: 9, november: 10, nov: 10,
    december: 11, dec: 11,
  };
  const s = dateStr.toLowerCase().trim().replace(/,/g, ' ').replace(/\s+/g, ' ');
  const yearMatch = s.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
  // "3 march" or "2nd March 2026" -> day first
  const dayFirst = s.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/);
  if (dayFirst) {
    const day = parseInt(dayFirst[1], 10);
    const month = months[dayFirst[2]];
    if (month !== undefined && day >= 1 && day <= 31) {
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? undefined : d;
    }
  }
  // "March 3" or "March 3 2026" -> month first
  const monthFirst = s.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/);
  if (monthFirst) {
    const month = months[monthFirst[1]];
    const day = parseInt(monthFirst[2], 10);
    if (month !== undefined && day >= 1 && day <= 31) {
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? undefined : d;
    }
  }
  return undefined;
};

/**
 * Parse date string into Date object (numeric formats only)
 */
const parseDate = (dateStr: string): Date | undefined => {
  try {
    // Handle different date formats
    const cleanDate = dateStr.replace(/[^\d\/\-]/g, '');
    const date = new Date(cleanDate);
    
    if (isNaN(date.getTime())) {
      return undefined;
    }
    
    return date;
  } catch {
    return undefined;
  }
};

/**
 * Validate parsed data
 */
export const validateParsedData = (data: ParsedSubscriptionData): boolean => {
  return !!(data.name && data.cost && data.billingCycle);
};